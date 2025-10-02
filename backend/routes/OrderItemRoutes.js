const router = require('express').Router();
const {
    createOrderItem,
    getOrderItemsByOrderId,
    getAllOrderItems,
    updateOrderItem,
    deleteOrderItem
} = require('../controllers/OrderItemController');

// Create order item
router.post('/', createOrderItem);

// Get all order items (Admin only)
router.get('/', getAllOrderItems);

// Get order items by order ID
router.get('/order/:orderId', getOrderItemsByOrderId);

// Update order item
router.put('/:id', updateOrderItem);

// Delete order item
router.delete('/:id', deleteOrderItem);

module.exports = router;

