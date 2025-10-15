const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Get all deliveries for a specific delivery staff
router.get('/staff/:staffId', deliveryController.getDeliveriesByStaff);

// Get all pending deliveries
router.get('/pending', deliveryController.getPendingDeliveries);

// Get all deliveries (for admin/management view)
router.get('/all', deliveryController.getAllDeliveries);

// Update delivery status
router.put('/:deliveryId/status', deliveryController.updateDeliveryStatus);

// Get delivery history for a staff member
router.get('/staff/:staffId/history', deliveryController.getDeliveryHistory);

// Get delivery statistics for a staff member
router.get('/staff/:staffId/stats', deliveryController.getDeliveryStats);

// Create a new delivery
router.post('/', deliveryController.createDelivery);

// Get single delivery details
router.get('/:deliveryId', deliveryController.getDeliveryById);

module.exports = router;



