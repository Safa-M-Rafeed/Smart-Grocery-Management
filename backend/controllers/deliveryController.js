const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');

// Get all deliveries for a specific delivery staff
const getDeliveriesByStaff = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ staffID: req.params.staffId })
      .populate('orderID')
      .populate('staffID')
      .sort({ deliveryDate: 1 });

    // Get detailed order information for each delivery
    const detailedDeliveries = await Promise.all(
      deliveries.map(async (delivery) => {
        const order = await Order.findById(delivery.orderID._id)
          .populate('customerID');
        
        const orderItems = await OrderItem.find({ orderID: delivery.orderID._id })
          .populate('productID');

        return {
          ...delivery.toObject(),
          orderDetails: {
            ...order.toObject(),
            orderItems: orderItems
          }
        };
      })
    );

    res.json(detailedDeliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all pending deliveries
const getPendingDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliveryStatus: 'Pending' })
      .populate('orderID')
      .populate('staffID')
      .sort({ deliveryDate: 1 });

    const detailedDeliveries = await Promise.all(
      deliveries.map(async (delivery) => {
        const order = await Order.findById(delivery.orderID._id)
          .populate('customerID');
        
        const orderItems = await OrderItem.find({ orderID: delivery.orderID._id })
          .populate('productID');

        return {
          ...delivery.toObject(),
          orderDetails: {
            ...order.toObject(),
            orderItems: orderItems
          }
        };
      })
    );

    res.json(detailedDeliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all deliveries (for admin/management view)
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('orderID')
      .populate('staffID')
      .sort({ deliveryDate: -1 });

    const detailedDeliveries = await Promise.all(
      deliveries.map(async (delivery) => {
        const order = await Order.findById(delivery.orderID._id)
          .populate('customerID');
        
        const orderItems = await OrderItem.find({ orderID: delivery.orderID._id })
          .populate('productID');

        return {
          ...delivery.toObject(),
          orderDetails: {
            ...order.toObject(),
            orderItems: orderItems
          }
        };
      })
    );

    res.json(detailedDeliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus, deliveryNotes, failureReason, latitude, longitude } = req.body;
    
    const updateData = { deliveryStatus };
    
    if (deliveryNotes) updateData.deliveryNotes = deliveryNotes;
    if (failureReason) updateData.failureReason = failureReason;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    
    // Set actual delivery time if status is Delivered
    if (deliveryStatus === 'Delivered') {
      updateData.actualDeliveryTime = new Date();
    }

    const delivery = await Delivery.findByIdAndUpdate(
      req.params.deliveryId,
      updateData,
      { new: true }
    ).populate('orderID').populate('staffID');

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // Update order status if delivery is completed
    if (deliveryStatus === 'Delivered') {
      await Order.findByIdAndUpdate(delivery.orderID._id, { status: 'Completed' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get delivery history for a staff member
const getDeliveryHistory = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let query = { staffID: req.params.staffId };
    
    if (status) {
      query.deliveryStatus = status;
    }
    
    if (startDate && endDate) {
      query.deliveryDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const deliveries = await Delivery.find(query)
      .populate('orderID')
      .populate('staffID')
      .sort({ deliveryDate: -1 });

    const detailedDeliveries = await Promise.all(
      deliveries.map(async (delivery) => {
        const order = await Order.findById(delivery.orderID._id)
          .populate('customerID');
        
        const orderItems = await OrderItem.find({ orderID: delivery.orderID._id })
          .populate('productID');

        return {
          ...delivery.toObject(),
          orderDetails: {
            ...order.toObject(),
            orderItems: orderItems
          }
        };
      })
    );

    res.json(detailedDeliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get delivery statistics for a staff member
const getDeliveryStats = async (req, res) => {
  try {
    const staffId = req.params.staffId;
    
    const totalDeliveries = await Delivery.countDocuments({ staffID: staffId });
    const completedDeliveries = await Delivery.countDocuments({ 
      staffID: staffId, 
      deliveryStatus: 'Delivered' 
    });
    const failedDeliveries = await Delivery.countDocuments({ 
      staffID: staffId, 
      deliveryStatus: 'Failed' 
    });
    const pendingDeliveries = await Delivery.countDocuments({ 
      staffID: staffId, 
      deliveryStatus: 'Pending' 
    });
    const inTransitDeliveries = await Delivery.countDocuments({ 
      staffID: staffId, 
      deliveryStatus: 'In Transit' 
    });

    const successRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

    res.json({
      totalDeliveries,
      completedDeliveries,
      failedDeliveries,
      pendingDeliveries,
      inTransitDeliveries,
      successRate: Math.round(successRate * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new delivery
const createDelivery = async (req, res) => {
  try {
    const { orderID, staffID, deliveryDate, estimatedDeliveryTime } = req.body;
    
    // Generate unique delivery ID
    const deliveryID = 'DEL' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const delivery = new Delivery({
      deliveryID,
      orderID,
      staffID,
      deliveryDate: new Date(deliveryDate),
      estimatedDeliveryTime: estimatedDeliveryTime ? new Date(estimatedDeliveryTime) : null,
      deliveryStatus: 'Pending'
    });

    await delivery.save();
    
    // Update order status to Ready for Delivery
    await Order.findByIdAndUpdate(orderID, { status: 'Ready for Delivery' });

    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate('orderID')
      .populate('staffID');

    res.status(201).json(populatedDelivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get single delivery details
const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.deliveryId)
      .populate('orderID')
      .populate('staffID');

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const order = await Order.findById(delivery.orderID._id)
      .populate('customerID');
    
    const orderItems = await OrderItem.find({ orderID: delivery.orderID._id })
      .populate('productID');

    const detailedDelivery = {
      ...delivery.toObject(),
      orderDetails: {
        ...order.toObject(),
        orderItems: orderItems
      }
    };

    res.json(detailedDelivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDeliveriesByStaff,
  getPendingDeliveries,
  getAllDeliveries,
  updateDeliveryStatus,
  getDeliveryHistory,
  getDeliveryStats,
  createDelivery,
  getDeliveryById
};
