const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Generate monthly delivery report PDF
router.get('/monthly/pdf', reportController.generateMonthlyReport);

// Get report statistics
router.get('/monthly/stats', reportController.getReportStats);

// Get available report periods
router.get('/periods', reportController.getAvailablePeriods);

module.exports = router;
