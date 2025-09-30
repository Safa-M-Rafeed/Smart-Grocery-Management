const router = require('express').Router();
const { searchProducts, getAllProducts, getProductById } = require('../controllers/productController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Search products
router.get('/search', requireAuth(['ADMIN', 'CASHIER', 'INVENTORY_CLERK']), searchProducts);

// Get all products
router.get('/', requireAuth(['ADMIN', 'CASHIER', 'INVENTORY_CLERK']), getAllProducts);

// Get product by ID
router.get('/:id', requireAuth(['ADMIN', 'CASHIER', 'INVENTORY_CLERK']), getProductById);

module.exports = router;
