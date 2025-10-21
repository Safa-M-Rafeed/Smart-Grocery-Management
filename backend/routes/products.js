const express = require('express');
const Product = require('../models/Product');
const PurchaseOrder = require('../models/PurchaseOrder'); // New import

const router = express.Router();

// ✅ Stats route must come BEFORE "/:id"
router.get('/stats', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          lowStock: {
            $sum: { $cond: [{ $lt: ['$quantity', '$minThreshold'] }, 1, 0] }
          },
          expired: {
            $sum: { $cond: [{ $lt: ['$expiryDate', '$$NOW'] }, 1, 0] }
          },
          nearExpired: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $gt: ['$expiryDate', '$$NOW'] },
                    { $lt: ['$expiryDate', { $add: ['$$NOW', 604800000] }] } // 7 days in ms
                  ]
                },
                then: 1,
                else: 0
              }
            }
          }
        }
      },
      {
        $project: { _id: 0, total: 1, lowStock: 1, expired: 1, nearExpired: 1 }
      }
    ]);

    if (!stats.length) return res.json({ total: 0, lowStock: 0, expired: 0, nearExpired: 0 });
    res.json(stats[0]);
  } catch (err) {
    console.error('❌ Stats error:', err);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const data = {
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      minThreshold: req.body.minThreshold ? Number(req.body.minThreshold) : 10,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
    };

    const product = new Product(data);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Product save error:", err);
    if (err.code === 11000 && err.keyValue?.sku) {
      return res.status(400).json({ message: `SKU "${err.keyValue.sku}" already exists.` });
    }
    res.status(400).json({
      message: err.message,
      errors: err.errors || null,
      code: err.code || null,
      keyValue: err.keyValue || null,
    });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const data = {
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      minThreshold: req.body.minThreshold ? Number(req.body.minThreshold) : 10,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Product update error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;