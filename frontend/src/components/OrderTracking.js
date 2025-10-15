import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderTracking.css';

const OrderTracking = ({ customer, onBackToCatalog }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    deliveryAddress: '',
    specialInstructions: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      const response = await axios.get('http://localhost:4000/api/customer/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'Processing': return '#3498db';
      case 'Ready for Delivery': return '#9b59b6';
      case 'Completed': return '#27ae60';
      case 'Cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getDeliveryStatusColor = (status) => {
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

  const formatPrice = (price) => {
    return `LKR ${price.toFixed(2)}`;
  };

  const canCancelOrder = (order) => {
    return order.status === 'Pending' || order.status === 'Processing' || order.status === 'Ready for Delivery';
  };

  const canUpdateOrder = (order) => {
    return order.status === 'Pending' || order.status === 'Processing' || order.status === 'Ready for Delivery';
  };

  const isOrderCompleted = (order) => {
    return order.status === 'Completed' || order.status === 'Cancelled' || 
           (order.delivery && order.delivery.deliveryStatus === 'Delivered');
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = localStorage.getItem('customerToken');
      await axios.put(`http://localhost:4000/api/customer/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh orders
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setEditForm({
      deliveryAddress: order.deliveryAddress,
      specialInstructions: order.specialInstructions || ''
    });
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    try {
      const token = localStorage.getItem('customerToken');
      await axios.put(`http://localhost:4000/api/customer/orders/${editingOrder._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh orders
      fetchOrders();
      setEditingOrder(null);
      setEditForm({ deliveryAddress: '', specialInstructions: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update order');
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditForm({ deliveryAddress: '', specialInstructions: '' });
  };

  if (loading) {
    return (
      <div className="order-tracking">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h2>My Orders</h2>
        <p>Track your delivery orders</p>
        <button onClick={onBackToCatalog} className="back-to-catalog-btn">
          Back to Catalog
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button onClick={onBackToCatalog} className="start-shopping-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderID}</h3>
                  <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-details">
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.orderItems.map((item, index) => (
                      <li key={index}>
                        {item.productID.productName} x {item.quantity} - {formatPrice(item.subtotal)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.totalAmount - 200)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee:</span>
                    <span>LKR 200.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Payment Method:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="delivery-info">
                <h4>Delivery Information:</h4>
                <p><strong>Address:</strong> {order.deliveryAddress}</p>
                {order.specialInstructions && (
                  <p><strong>Instructions:</strong> {order.specialInstructions}</p>
                )}
                
                {order.delivery && (
                  <div className="delivery-status">
                    <h4>Delivery Status:</h4>
                    <div className="delivery-details">
                      <span 
                        className="delivery-status-badge"
                        style={{ backgroundColor: getDeliveryStatusColor(order.delivery.deliveryStatus) }}
                      >
                        {order.delivery.deliveryStatus}
                      </span>
                      {order.delivery.staffID && (
                        <p><strong>Delivery Staff:</strong> {order.delivery.staffID.staffName}</p>
                      )}
                      {order.delivery.estimatedDeliveryTime && (
                        <p><strong>Estimated Delivery:</strong> {formatDate(order.delivery.estimatedDeliveryTime)}</p>
                      )}
                      {order.delivery.actualDeliveryTime && (
                        <p><strong>Delivered At:</strong> {formatDate(order.delivery.actualDeliveryTime)}</p>
                      )}
                      {order.delivery.deliveryNotes && (
                        <p><strong>Notes:</strong> {order.delivery.deliveryNotes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="order-actions">
                {isOrderCompleted(order) ? (
                  <div className="completed-order-notice">
                    <span className="notice-text">This order has been completed and cannot be modified.</span>
                  </div>
                ) : (
                  <div className="action-buttons">
                    {canUpdateOrder(order) && (
                      <button 
                        onClick={() => handleEditOrder(order)}
                        className="edit-order-btn"
                      >
                        Update Order
                      </button>
                    )}
                    {canCancelOrder(order) && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        className="cancel-order-btn"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Order Details</h3>
              <button onClick={handleCancelEdit} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address *</label>
                <textarea
                  id="deliveryAddress"
                  value={editForm.deliveryAddress}
                  onChange={(e) => setEditForm({...editForm, deliveryAddress: e.target.value})}
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="specialInstructions">Special Instructions</label>
                <textarea
                  id="specialInstructions"
                  value={editForm.specialInstructions}
                  onChange={(e) => setEditForm({...editForm, specialInstructions: e.target.value})}
                  placeholder="Any special delivery instructions (optional)"
                  rows="2"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
              <button onClick={handleUpdateOrder} className="submit-btn">Update Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;



