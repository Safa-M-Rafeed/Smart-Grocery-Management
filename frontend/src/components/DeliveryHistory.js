import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryHistory.css';

const DeliveryHistory = ({ staffId }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('deliveryToken');
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(
        `http://localhost:4000/api/delivery/staff/${staffId}/history?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setDeliveries(response.data);
    } catch (err) {
      console.error('Failed to fetch delivery history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'In Transit': return '#3498db';
      case 'Delivered': return '#27ae60';
      case 'Failed': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading delivery history...</div>;
  }

  return (
    <div className="delivery-history">
      <div className="history-header">
        <h2>Delivery History</h2>
        <p>View and filter your past deliveries</p>
      </div>

      <div className="history-filters">
        <div className="filter-group">
          <label>Status</label>
          <select 
            name="status" 
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input 
            type="date" 
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input 
            type="date" 
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      <div className="history-content">
        {deliveries.length === 0 ? (
          <div className="no-history">
            <p>No delivery history found for the selected filters.</p>
          </div>
        ) : (
          <div className="history-table">
            <div className="table-header">
              <div>Delivery ID</div>
              <div>Customer</div>
              <div>Address</div>
              <div>Status</div>
              <div>Date</div>
              <div>Amount</div>
            </div>
            
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="table-row">
                <div className="delivery-id">
                  #{delivery.deliveryID}
                </div>
                <div className="customer-name">
                  {delivery.orderDetails.customerID.customerName}
                </div>
                <div className="delivery-address">
                  {delivery.orderDetails.deliveryAddress}
                </div>
                <div className="delivery-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(delivery.deliveryStatus) }}
                  >
                    {delivery.deliveryStatus}
                  </span>
                </div>
                <div className="delivery-date">
                  {formatDate(delivery.deliveryDate)}
                </div>
                <div className="delivery-amount">
                  LKR{delivery.orderDetails.totalAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;



