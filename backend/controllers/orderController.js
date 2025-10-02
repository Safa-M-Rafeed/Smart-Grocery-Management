const Order = require('../models/Order');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { customerID, totalAmount, paymentMethod, loyaltyPointsUsed, loyaltyDiscount } = req.body;

        // Validate required fields
        if (!totalAmount || !paymentMethod) {
            return res.status(400).json({
                message: 'Total amount and payment method are required'
            });
        }

        // Create order with timestamp to ensure uniqueness
        const order = new Order({
            customerID: customerID || null,
            totalAmount,
            paymentMethod: paymentMethod.toUpperCase(),
            loyaltyPointsUsed: loyaltyPointsUsed || 0,
            loyaltyDiscount: loyaltyDiscount || 0,
            orderDate: new Date(),
            // Add a unique order number based on timestamp
            orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        });

        const savedOrder = await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder
        });
    } catch (error) {
        console.error('Order creation error:', error);

        if (error.code === 11000) {
            // Log the exact duplicate key error
            console.error('Duplicate key error details:', error.keyPattern, error.keyValue);
            return res.status(400).json({
                message: 'Order already exists. Please try again.',
                error: `Duplicate key on field: ${Object.keys(error.keyPattern || {})[0]}`
            });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerID', 'customerName phone email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('customerID', 'customerName phone email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById
};
