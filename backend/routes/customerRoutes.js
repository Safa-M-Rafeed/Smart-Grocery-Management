const router = require('express').Router();
const {
    checkCustomerByPhone,
    createCustomer,
    calculateLoyaltyPoints,
    applyLoyaltyDiscount
} = require('../controllers/customerController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Check customer by phone
router.get('/check-phone', requireAuth(['ADMIN', 'CASHIER']), checkCustomerByPhone);

// Create new customer
router.post('/', requireAuth(['ADMIN', 'CASHIER']), createCustomer);

// Calculate loyalty points
router.post('/calculate-points', requireAuth(['ADMIN', 'CASHIER']), (req, res) => {
    const { totalAmount } = req.body;
    const points = calculateLoyaltyPoints(totalAmount);
    res.json({ points });
});

// Calculate discount
router.post('/calculate-discount', requireAuth(['ADMIN', 'CASHIER']), (req, res) => {
    const { totalAmount, pointsToRedeem } = req.body;
    const result = applyLoyaltyDiscount(totalAmount, pointsToRedeem);
    res.json(result);
});

module.exports = router;
