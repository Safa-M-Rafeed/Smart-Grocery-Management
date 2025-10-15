import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryStats.css';

const DeliveryStats = ({ staffId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('deliveryToken');
      const response = await axios.get(
        `http://localhost:4000/api/delivery/staff/${staffId}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch delivery stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading performance statistics...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load statistics</div>;
  }

  return (
    <div className="delivery-stats">
      <div className="stats-header">
        <h2>Performance Statistics</h2>
        <p>Your delivery performance overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalDeliveries}</h3>
            <p>Total Deliveries</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedDeliveries}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card failed">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.failedDeliveries}</h3>
            <p>Failed</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingDeliveries}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card in-transit">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{stats.inTransitDeliveries}</h3>
            <p>In Transit</p>
          </div>
        </div>

        <div className="stat-card success-rate">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.successRate}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      <div className="performance-summary">
        <h3>Performance Summary</h3>
        <div className="summary-content">
          <div className="summary-item">
            <span className="label">Total Deliveries:</span>
            <span className="value">{stats.totalDeliveries}</span>
          </div>
          <div className="summary-item">
            <span className="label">Successfully Delivered:</span>
            <span className="value">{stats.completedDeliveries}</span>
          </div>
          <div className="summary-item">
            <span className="label">Failed Deliveries:</span>
            <span className="value">{stats.failedDeliveries}</span>
          </div>
          <div className="summary-item">
            <span className="label">Success Rate:</span>
            <span className="value">{stats.successRate}%</span>
          </div>
        </div>
      </div>

      <div className="performance-tips">
        <h3>Performance Tips</h3>
        <div className="tips-content">
          {stats.successRate >= 90 ? (
            <div className="tip success">
              <strong>Excellent Performance!</strong> You're maintaining a high success rate. Keep up the great work!
            </div>
          ) : stats.successRate >= 75 ? (
            <div className="tip good">
              <strong>Good Performance!</strong> You're doing well. Focus on reducing failed deliveries to improve further.
            </div>
          ) : (
            <div className="tip improvement">
              <strong>Room for Improvement</strong> Consider reviewing failed delivery reasons and improving communication with customers.
            </div>
          )}
          
          <div className="tip general">
            <strong>General Tips:</strong>
            <ul>
              <li>Always confirm delivery addresses before departure</li>
              <li>Call customers if you can't find the address</li>
              <li>Take photos of delivered packages when possible</li>
              <li>Update delivery status in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStats;



