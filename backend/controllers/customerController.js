const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Delivery = require('../models/Delivery');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');

// Get all products (product catalog)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantityInStock: { $gt: 0 } })
      .sort({ category: 1, productName: 1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const { items, deliveryAddress, specialInstructions, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    if (!['Cash on Delivery', 'Online Payment'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      
      if (product.quantityInStock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.productName}. Available: ${product.quantityInStock}` 
        });
      }
      
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      
      orderItems.push({
        productID: product._id,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    // Add delivery fee
    const deliveryFee = 200; // 200 LKR delivery fee
    totalAmount += deliveryFee;

    // Validate cash on delivery limit (2000 LKR)
    if (paymentMethod === 'Cash on Delivery' && totalAmount > 2000) {
      return res.status(400).json({ 
        error: 'Cash on Delivery is only available for orders below 2000 LKR. Please choose Online Payment for orders above 2000 LKR.' 
      });
    }

    // Generate unique order ID
    const orderID = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Create order
    const order = new Order({
      orderID,
      customerID: decoded.customerId,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      specialInstructions,
      status: 'Pending',
      paymentStatus: paymentMethod === 'Online Payment' ? 'Pending' : 'Pending'
    });

    await order.save();

    // Create order items
    const createdOrderItems = await Promise.all(
      orderItems.map(item => 
        new OrderItem({
          orderID: order._id,
          productID: item.productID,
          quantity: item.quantity,
          subtotal: item.subtotal
        }).save()
      )
    );

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantityInStock: -item.quantity } }
      );
    }

    // Populate order with customer
    const populatedOrder = await Order.findById(order._id)
      .populate('customerID');

    // Get order items with product details
    const orderItemsWithProducts = await OrderItem.find({ orderID: order._id })
      .populate('productID');

    // Automatically create delivery for the order
    try {
      // Find available delivery staff (active staff with role "Delivery Staff")
      const availableStaff = await Staff.findOne({ 
        role: "Delivery Staff", 
        isActive: true 
      });

      if (availableStaff) {
        // Generate unique delivery ID
        const deliveryID = 'DEL' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Create delivery record
        const delivery = new Delivery({
          deliveryID,
          orderID: order._id,
          staffID: availableStaff._id,
          deliveryDate: new Date(),
          estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          deliveryStatus: 'Pending'
        });

        await delivery.save();

        // Update order status to Ready for Delivery
        await Order.findByIdAndUpdate(order._id, { status: 'Ready for Delivery' });

        console.log(`Delivery created for order ${orderID} assigned to staff ${availableStaff.staffName}`);
      } else {
        console.log(`No available delivery staff found for order ${orderID}`);
      }
    } catch (deliveryError) {
      console.error('Error creating delivery:', deliveryError);
      // Don't fail the order creation if delivery creation fails
    }

    res.status(201).json({
      order: {
        ...populatedOrder.toObject(),
        orderItems: orderItemsWithProducts
      },
      orderItems: createdOrderItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get customer orders
const getCustomerOrders = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const orders = await Order.find({ customerID: decoded.customerId })
      .populate('customerID')
      .sort({ createdAt: -1 });

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({ orderID: order._id })
          .populate('productID');
        
        // Check if delivery exists for this order
        const delivery = await Delivery.findOne({ orderID: order._id })
          .populate('staffID');
        
        return {
          ...order.toObject(),
          orderItems,
          delivery
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single order details
const getOrderById = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const order = await Order.findById(req.params.orderId)
      .populate('customerID');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order belongs to customer
    if (order.customerID._id.toString() !== decoded.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const orderItems = await OrderItem.find({ orderID: order._id })
      .populate('productID');

    const delivery = await Delivery.findOne({ orderID: order._id })
      .populate('staffID');

    res.json({
      ...order.toObject(),
      orderItems,
      delivery
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel order (only if status is Pending or Processing)
const cancelOrder = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order belongs to customer
    if (order.customerID.toString() !== decoded.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if delivery exists and its status
    const delivery = await Delivery.findOne({ orderID: order._id });
    
    // Only allow cancellation if order is pending/processing and delivery is not completed
    if (order.status === 'Completed' || order.status === 'Cancelled') {
      return res.status(400).json({ 
        error: 'Order cannot be cancelled. Current status: ' + order.status 
      });
    }

    if (delivery && delivery.deliveryStatus === 'Delivered') {
      return res.status(400).json({ 
        error: 'Order cannot be cancelled. Delivery has been completed.' 
      });
    }

    // Update order status
    order.status = 'Cancelled';
    await order.save();

    // Cancel delivery if it exists
    if (delivery) {
      delivery.deliveryStatus = 'Failed';
      delivery.failureReason = 'Order cancelled by customer';
      await delivery.save();
    }

    // Restore product stock
    const orderItems = await OrderItem.find({ orderID: order._id });
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productID,
        { $inc: { quantityInStock: item.quantity } }
      );
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order details (only if not completed)
const updateOrder = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order belongs to customer
    if (order.customerID.toString() !== decoded.customerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if delivery exists and its status
    const delivery = await Delivery.findOne({ orderID: order._id });
    
    // Only allow updates if order is not completed and delivery is not delivered
    if (order.status === 'Completed' || order.status === 'Cancelled') {
      return res.status(400).json({ 
        error: 'Order cannot be updated. Current status: ' + order.status 
      });
    }

    if (delivery && delivery.deliveryStatus === 'Delivered') {
      return res.status(400).json({ 
        error: 'Order cannot be updated. Delivery has been completed.' 
      });
    }

    const { deliveryAddress, specialInstructions } = req.body;
    
    // Update order details
    if (deliveryAddress) order.deliveryAddress = deliveryAddress;
    if (specialInstructions !== undefined) order.specialInstructions = specialInstructions;
    
    await order.save();

    // Populate order with customer
    const populatedOrder = await Order.findById(order._id)
      .populate('customerID');

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createOrder,
  getCustomerOrders,
  getOrderById,
  cancelOrder,
  updateOrder
};
