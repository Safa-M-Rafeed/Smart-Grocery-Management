const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Get all products (product catalog)
router.get('/products', customerController.getAllProducts);

// Get single product
router.get('/products/:productId', customerController.getProductById);

// Create new order
router.post('/orders', customerController.createOrder);

// Get customer orders
router.get('/orders', customerController.getCustomerOrders);

// Get single order details
router.get('/orders/:orderId', customerController.getOrderById);

// Cancel order (only if status is Pending)
router.put('/orders/:orderId/cancel', customerController.cancelOrder);

// Update order details (only if not completed)
router.put('/orders/:orderId', customerController.updateOrder);

module.exports = router;
