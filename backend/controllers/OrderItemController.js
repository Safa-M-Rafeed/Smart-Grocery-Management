const OrderItem = require('../models/OrderItem');

// Create a new order item
const createOrderItem = async (req, res) => {
    try {
        const { orderID, productID, quantity, subtotal } = req.body;

        // Validate required fields
        if (!orderID || !productID || !quantity || !subtotal) {
            return res.status(400).json({
                message: 'Order ID, Product ID, quantity, and subtotal are required'
            });
        }

        // Create order item
        const orderItem = new OrderItem({
            orderID,
            productID,
            quantity,
            subtotal
        });

        const savedOrderItem = await orderItem.save();

        res.status(201).json({
            message: 'Order item created successfully',
            orderItem: savedOrderItem
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order items by order ID
const getOrderItemsByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        const orderItems = await OrderItem.find({ orderID: orderId })
            .populate('productID', 'productName price category')
            .populate('orderID', 'totalAmount date paymentMethod');

        res.json(orderItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all order items (Admin only)
const getAllOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItem.find()
            .populate('productID', 'productName price category')
            .populate('orderID', 'totalAmount date paymentMethod customerID')
            .sort({ createdAt: -1 });

        res.json(orderItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order item
const updateOrderItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, subtotal } = req.body;

        const orderItem = await OrderItem.findByIdAndUpdate(
            id,
            { quantity, subtotal },
            { new: true }
        ).populate('productID', 'productName price');

        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        res.json({
            message: 'Order item updated successfully',
            orderItem
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete order item
const deleteOrderItem = async (req, res) => {
    try {
        const { id } = req.params;

        const orderItem = await OrderItem.findByIdAndDelete(id);

        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        res.json({ message: 'Order item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrderItem,
    getOrderItemsByOrderId,
    getAllOrderItems,
    updateOrderItem,
    deleteOrderItem
};
