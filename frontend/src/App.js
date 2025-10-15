import React, { useState, useEffect } from 'react';
import './App.css';
import DeliveryDashboard from './components/DeliveryDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import UnifiedLogin from './components/UnifiedLogin';

function App() {
  const [userType, setUserType] = useState(null); // 'customer' or 'delivery'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const customerToken = localStorage.getItem('customerToken');
    const customerData = localStorage.getItem('customer');
    const deliveryToken = localStorage.getItem('deliveryToken');
    const deliveryStaff = localStorage.getItem('deliveryStaff');
    
    if (customerToken && customerData) {
      setUserType('customer');
      setUser(JSON.parse(customerData));
      setIsLoggedIn(true);
    } else if (deliveryToken && deliveryStaff) {
      setUserType('delivery');
      setUser(JSON.parse(deliveryStaff));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData, type) => {
    setUserType(type);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
    localStorage.removeItem('deliveryToken');
    localStorage.removeItem('deliveryStaff');
    
    setUserType(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    if (userType === 'customer') {
      return <CustomerDashboard customer={user} onLogout={handleLogout} />;
    } else if (userType === 'delivery') {
      return <DeliveryDashboard staff={user} onLogout={handleLogout} />;
    }
  }

  return <UnifiedLogin onLogin={handleLogin} />;
}

export default App;