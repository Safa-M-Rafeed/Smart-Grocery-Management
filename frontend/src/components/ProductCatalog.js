import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductCatalog.css';

const ProductCatalog = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/customer/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = ['All', ...new Set(products.map(product => product.category))];
    return categories;
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price) => {
    return `LKR ${price.toFixed(2)}`;
  };

  const formatExpiryDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  if (loading) {
    return (
      <div className="product-catalog">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h2>Product Catalog</h2>
        <p>Browse our fresh grocery items</p>
      </div>

      <div className="catalog-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <label>Category:</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {getCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <div className="product-category">{product.category}</div>
                {isExpiringSoon(product.expiryDate) && (
                  <div className="expiry-warning">Expires Soon!</div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.productName}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
                <p className="product-stock">
                  Stock: {product.quantityInStock} units
                </p>
                <p className="product-expiry">
                  Expires: {formatExpiryDate(product.expiryDate)}
                </p>
              </div>

              <div className="product-actions">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="add-to-cart-btn"
                  disabled={product.quantityInStock === 0}
                >
                  {product.quantityInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;



