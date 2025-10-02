const Product = require('../models/Product');

// Search products
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        let searchQuery = {};

        if (query) {
            searchQuery = {
                $or: [
                    { productName: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const products = await Product.find(searchQuery)
            .populate('supplierID', 'name')
            .limit(50);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ quantityInStock: { $gt: 0 } })
            .populate('supplierID', 'name')
            .limit(100);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('supplierID', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    searchProducts,
    getAllProducts,
    getProductById
};
