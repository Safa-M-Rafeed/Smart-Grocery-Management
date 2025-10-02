const router = require('express').Router();
const {
    checkCustomerByPhone,
    checkCustomerByEmail,
    addPhoneToExistingCustomer,
    createCustomer
} = require('../controllers/customerController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Check customer by phone
router.get('/check-phone', requireAuth(['ADMIN', 'CASHIER']), checkCustomerByPhone);

// Check customer by email and loyalty card status
router.get('/check-email', requireAuth(['ADMIN', 'CASHIER']), checkCustomerByEmail);

// Add phone number to existing customer for loyalty card
router.patch('/add-phone', requireAuth(['ADMIN', 'CASHIER']), addPhoneToExistingCustomer);

// Create new customer with loyalty card
router.post('/', requireAuth(['ADMIN', 'CASHIER']), createCustomer);

module.exports = router;
// Calculate discount
router.post('/calculate-discount', requireAuth(['ADMIN', 'CASHIER']), (req, res) => {
    const { totalAmount, pointsToRedeem } = req.body;
    const result = applyLoyaltyDiscount(totalAmount, pointsToRedeem);
    res.json(result);
});

module.exports = router;
