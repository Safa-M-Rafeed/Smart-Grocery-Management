import React, { useState } from 'react';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';
import Checkout from './Checkout';
import OrderTracking from './OrderTracking';
import './CustomerDashboard.css';

const CustomerDashboard = ({ customer, onLogout }) => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [cartItems, setCartItems] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity < product.quantityInStock) {
        setCartItems(cartItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
  };

  const proceedToCheckout = () => {
    setActiveTab('checkout');
  };

  const handleOrderPlaced = (order) => {
    setCurrentOrder(order);
    setCartItems([]);
    setActiveTab('tracking');
  };

  const backToCatalog = () => {
    setActiveTab('catalog');
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
    onLogout();
  };

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Smart Grocery Delivery</h1>
          <div className="customer-info">
            <span>Welcome, {customer.customerName}</span>
            <span className="loyalty-points">Loyalty Points: {customer.loyaltyPoints}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'catalog' ? 'active' : ''}
          onClick={() => setActiveTab('catalog')}
        >
          Browse Products
        </button>
        <button 
          className={activeTab === 'tracking' ? 'active' : ''}
          onClick={() => setActiveTab('tracking')}
        >
          My Orders
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'catalog' && (
          <>
            <ProductCatalog onAddToCart={addToCart} />
            <ShoppingCart 
              cartItems={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onProceedToCheckout={proceedToCheckout}
            />
          </>
        )}
        
        {activeTab === 'checkout' && (
          <Checkout 
            cartItems={cartItems}
            customer={customer}
            onOrderPlaced={handleOrderPlaced}
            onBackToCatalog={backToCatalog}
          />
        )}
        
        {activeTab === 'tracking' && (
          <OrderTracking 
            customer={customer}
            onBackToCatalog={backToCatalog}
          />
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;



