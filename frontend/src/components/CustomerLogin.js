import React, { useState } from 'react';
import axios from 'axios';
import './CustomerLogin.css';

const CustomerLogin = ({ onLogin, onSwitchToRegister }) => {
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
      const response = await axios.post('http://localhost:4000/api/customer-auth/login', formData);
      
      // Store token and customer info in localStorage
      localStorage.setItem('customerToken', response.data.token);
      localStorage.setItem('customer', JSON.stringify(response.data.customer));
      
      onLogin(response.data.customer);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-login-container">
      <div className="customer-login-card">
        <div className="customer-login-header">
          <h2>Customer Login</h2>
          <p>Access your grocery shopping dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="customer-login-form">
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
        
        <div className="auth-switch">
          <p>Don't have an account? <button onClick={onSwitchToRegister} className="switch-btn">Register</button></p>
        </div>
        
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p>Email: john.smith@email.com | Password: customer123</p>
          <p>Email: sarah.johnson@email.com | Password: customer123</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;



