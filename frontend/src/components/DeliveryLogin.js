import React, { useState } from 'react';
import axios from 'axios';
import './DeliveryLogin.css';

const DeliveryLogin = ({ onLogin }) => {
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
      const response = await axios.post('http://localhost:4000/api/delivery-auth/login', formData);
      
      // Store token and staff info in localStorage
      localStorage.setItem('deliveryToken', response.data.token);
      localStorage.setItem('deliveryStaff', JSON.stringify(response.data.staff));
      
      onLogin(response.data.staff);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delivery-login-container">
      <div className="delivery-login-card">
        <div className="delivery-login-header">
          <h2>Delivery Staff Login</h2>
          <p>Access your delivery management dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="delivery-login-form">
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
        
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p>Email: alex.rodriguez@store.com</p>
          <p>Password: delivery123</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLogin;



