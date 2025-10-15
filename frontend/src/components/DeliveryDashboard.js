import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeliveryList from './DeliveryList';
import DeliveryMap from './DeliveryMap';
import DeliveryHistory from './DeliveryHistory';
import DeliveryStats from './DeliveryStats';
import ReportGenerator from './ReportGenerator';
import './DeliveryDashboard.css';

const DeliveryDashboard = ({ staff, onLogout }) => {
  const [activeTab, setActiveTab] = useState('deliveries');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('deliveryToken');
      const response = await axios.get(`http://localhost:4000/api/delivery/staff/${staff.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(response.data);
    } catch (err) {
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId, status, notes = '', failureReason = '') => {
    try {
      const token = localStorage.getItem('deliveryToken');
      await axios.put(`http://localhost:4000/api/delivery/${deliveryId}/status`, {
        deliveryStatus: status,
        deliveryNotes: notes,
        failureReason: failureReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh deliveries
      fetchDeliveries();
    } catch (err) {
      setError('Failed to update delivery status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('deliveryToken');
    localStorage.removeItem('deliveryStaff');
    onLogout();
  };

  if (loading) {
    return (
      <div className="delivery-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="delivery-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Delivery Management System</h1>
          <div className="staff-info">
            <span>Welcome, {staff.staffName}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'deliveries' ? 'active' : ''}
          onClick={() => setActiveTab('deliveries')}
        >
          My Deliveries
        </button>
        <button 
          className={activeTab === 'map' ? 'active' : ''}
          onClick={() => setActiveTab('map')}
        >
          Delivery Map
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Delivery History
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Performance Stats
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          📊 Reports
        </button>
      </nav>

      <main className="dashboard-content">
        {error && <div className="error-banner">{error}</div>}
        
        {activeTab === 'deliveries' && (
          <DeliveryList 
            deliveries={deliveries}
            onUpdateStatus={updateDeliveryStatus}
            onRefresh={fetchDeliveries}
          />
        )}
        
        {activeTab === 'map' && (
          <DeliveryMap 
            deliveries={deliveries}
            onUpdateStatus={updateDeliveryStatus}
          />
        )}
        
        {activeTab === 'history' && (
          <DeliveryHistory staffId={staff.id} />
        )}
        
        {activeTab === 'stats' && (
          <DeliveryStats staffId={staff.id} />
        )}
        
        {activeTab === 'reports' && (
          <ReportGenerator />
        )}
      </main>
    </div>
  );
};

export default DeliveryDashboard;



