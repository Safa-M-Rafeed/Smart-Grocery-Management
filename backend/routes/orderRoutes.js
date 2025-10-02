const router = require('express').Router();
const {
    createOrder,
    getAllOrders,
    getOrderById
} = require('../controllers/orderController');

// Create order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get order by ID
router.get('/:id', getOrderById);

module.exports = router;
module.exports = router;
