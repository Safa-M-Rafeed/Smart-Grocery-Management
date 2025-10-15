import React, { useState } from 'react';
import axios from 'axios';
import './UnifiedLogin.css';

const UnifiedLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      // Try customer login first
      try {
        const customerResponse = await axios.post('http://localhost:4000/api/customer-auth/login', formData);
        
        // Store token and customer info in localStorage
        localStorage.setItem('customerToken', customerResponse.data.token);
        localStorage.setItem('customer', JSON.stringify(customerResponse.data.customer));
        
        onLogin(customerResponse.data.customer, 'customer');
        return;
      } catch (customerError) {
        // If customer login fails, try delivery login
        try {
          const deliveryResponse = await axios.post('http://localhost:4000/api/delivery-auth/login', formData);
          
          // Store token and staff info in localStorage
          localStorage.setItem('deliveryToken', deliveryResponse.data.token);
          localStorage.setItem('deliveryStaff', JSON.stringify(deliveryResponse.data.staff));
          
          onLogin(deliveryResponse.data.staff, 'delivery');
          return;
        } catch (deliveryError) {
          // Both logins failed
          setError('Invalid email or password. Please check your credentials.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unified-login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Smart Grocery Management</h2>
          <p>Login to access your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default UnifiedLogin;
