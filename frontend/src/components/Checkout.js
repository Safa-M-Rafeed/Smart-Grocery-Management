import React, { useState } from 'react';
import axios from 'axios';
import './Checkout.css';

const Checkout = ({ cartItems, customer, onOrderPlaced, onBackToCatalog }) => {
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 200; // 200 LKR delivery fee
    return subtotal + deliveryFee;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.deliveryAddress.trim()) {
      setError('Delivery address is required');
      setLoading(false);
      return;
    }

    if (!formData.paymentMethod) {
      setError('Please select a payment method');
      setLoading(false);
      return;
    }

    // Validate cash on delivery limit
    if (formData.paymentMethod === 'Cash on Delivery' && calculateTotal() > 2000) {
      setError('Cash on Delivery is only available for orders below 2000 LKR. Please choose Online Payment for orders above 2000 LKR.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('customerToken');
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: formData.deliveryAddress,
        specialInstructions: formData.specialInstructions,
        paymentMethod: formData.paymentMethod
      };

      const response = await axios.post('http://localhost:4000/api/customer/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onOrderPlaced(response.data.order);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `LKR ${price.toFixed(2)}`;
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <p>Review your order and provide delivery details</p>
      </div>

      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item._id} className="order-item">
                <div className="item-details">
                  <h4>{item.productName}</h4>
                  <p className="item-category">{item.category}</p>
                </div>
                <div className="item-quantity">Qty: {item.quantity}</div>
                <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee:</span>
              <span>LKR 200.00</span>
            </div>
            <div className="total-row total">
              <span>Total:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </div>

        <div className="delivery-form">
          <h3>Delivery Information</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="deliveryAddress">Delivery Address *</label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                placeholder="Enter your complete delivery address"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialInstructions">Special Instructions</label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                placeholder="Any special delivery instructions (optional)"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery</span>
                  <small>(Available for orders below 2000 LKR)</small>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={formData.paymentMethod === 'Online Payment'}
                    onChange={handleChange}
                  />
                  <span>Online Payment</span>
                  <small>(Credit/Debit Card, Digital Wallet)</small>
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button 
                type="button"
                onClick={onBackToCatalog}
                className="back-btn"
              >
                Back to Catalog
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="place-order-btn"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;



