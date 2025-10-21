const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const PurchaseOrder = require('../models/PurchaseOrder');
const cron = require('node-cron');

// Helper function to generate unique PO number
const generateUniquePoNumber = async () => {
  try {
    let poIndex = 1;
    let poNumber;
    
    while (true) {
      poNumber = `PO-${poIndex.toString().padStart(4, '0')}`;
      const existing = await PurchaseOrder.findOne({ poNumber });
      if (!existing) {
        return poNumber;
      }
      poIndex++;
    }
  } catch (err) {
    throw new Error(`Failed to generate unique PO number: ${err.message}`);
  }
};

const generatePurchaseOrders = async (req = null, res = null) => {
  const isAuto = res === null;
  try {
    // Fetch low stock products
    const lowStock = await Product.find({
      $expr: { $lt: ["$quantity", "$minThreshold"] }
    }).lean();

    let message = '';
    if (!lowStock.length) {
      message = 'No low stock items found';
      if (isAuto) {
        console.log(message);
        return;
      } else {
        return res.status(200).json({ message });
      }
    }

    // Filter products without existing open POs (pending or sent) for their supplier
    let productsNeedingPO = [];
    for (let product of lowStock) {
      if (!product._id || !product.supplier || !product.supplier.trim()) {
        console.warn(`Skipping product with invalid data: ${JSON.stringify({
          id: product._id,
          name: product.name,
          supplier: product.supplier
        })}`);
        continue;
      }
      const existingPO = await PurchaseOrder.findOne({
        supplier: product.supplier,
        status: { $in: ['pending', 'sent'] },
        products: { $elemMatch: { productId: product._id } }
      });
      if (!existingPO) {
        productsNeedingPO.push(product);
      } else {
        console.log(`Skipping product ${product.name} for supplier ${product.supplier}: already in PO ${existingPO.poNumber}`);
      }
    }

    if (!productsNeedingPO.length) {
      message = 'All low stock items already have pending or sent purchase orders for their suppliers';
      if (isAuto) {
        console.log(message);
        return;
      } else {
        return res.status(200).json({ message });
      }
    }

    // Group low-stock products by supplier
    const supplierGroups = productsNeedingPO.reduce((groups, product) => {
      const supplier = product.supplier.trim();
      if (!groups[supplier]) {
        groups[supplier] = [];
      }
      groups[supplier].push({
        productId: product._id,
        name: product.name || 'Unknown Product',
        quantityToOrder: Math.max((product.minThreshold - product.quantity) + 10, 1)
      });
      return groups;
    }, {});

    if (Object.keys(supplierGroups).length === 0) {
      message = 'No low stock items with valid suppliers found';
      if (isAuto) {
        console.log(message);
        return;
      } else {
        return res.status(200).json({ message });
      }
    }

    // Create POs for each supplier group
    for (const [supplier, products] of Object.entries(supplierGroups)) {
      const poNumber = await generateUniquePoNumber();
      const po = new PurchaseOrder({
        poNumber,
        supplier,
        products,
        status: 'pending'
      });
      await po.save();
      console.log(`Generated PO ${poNumber} for supplier ${supplier}`);
    }

    message = 'Purchase orders generated successfully';
    if (isAuto) {
      console.log(message);
    } else {
      res.status(201).json({ message });
    }
  } catch (err) {
    const errorMessage = 'Failed to generate purchase orders';
    if (isAuto) {
      console.error(errorMessage, err);
    } else {
      console.error('Generate PO error:', err);
      res.status(500).json({
        message: errorMessage,
        error: err.message || 'Unknown error'
      });
    }
  }
};

// Generate POs for low stock items, skipping duplicates
router.post('/generate', (req, res) => generatePurchaseOrders(req, res));

// GET all purchase orders
router.get('/', async (req, res) => {
  try {
    const pos = await PurchaseOrder.find().populate('products.productId', 'name price').sort({ createdAt: -1 });
    res.json(pos);
  } catch (err) {
    console.error('Get POs error:', err);
    res.status(500).json({ message: 'Server error while fetching purchase orders', error: err.message });
  }
});

// GET single purchase order by ID
router.get('/:id', async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id).populate('products.productId', 'name price');
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }
    res.json(po);
  } catch (err) {
    console.error('Get PO error:', err);
    res.status(500).json({ message: 'Server error while fetching purchase order', error: err.message });
  }
});

// Update PO status (and update stock if received)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'sent', 'received', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }

    const updatedPO = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (status === 'received') {
      for (let prod of po.products) {
        try {
          if (!prod.productId) {
            console.warn(`Skipping product update for invalid productId in PO ${po.poNumber}`);
            continue;
          }
          await Product.findByIdAndUpdate(
            prod.productId,
            { $inc: { quantity: prod.quantityToOrder } },
            { new: true }
          );
        } catch (updateError) {
          console.error(`Error updating product ${prod.productId} in PO ${po.poNumber}:`, updateError);
        }
      }
    }

    if (status === 'sent') {
      console.log(`PO sent to supplier ${po.supplier}: ${po.poNumber}`);
    }

    res.json(updatedPO);
  } catch (err) {
    console.error('Update PO error:', err);
    res.status(500).json({ message: 'Server error while updating purchase order', error: err.message });
  }
});

// Delete PO
router.delete('/:id', async (req, res) => {
  try {
    const deletedPO = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!deletedPO) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }
    
    console.log(`PO deleted: ${deletedPO.poNumber}`);
    res.json({ message: 'Purchase Order deleted successfully' });
  } catch (err) {
    console.error('Delete PO error:', err);
    res.status(500).json({ message: 'Server error while deleting purchase order', error: err.message });
  }
});

// Auto generate mode: schedule every minute if enabled via env
if (process.env.AUTO_GENERATE_PO === 'true') {
  cron.schedule('* * * * *', async () => {
    console.log('Running auto purchase order generation');
    await generatePurchaseOrders();
  });
}

module.exports = router;