import React, { useState } from 'react';
import './DeliveryList.css';

const DeliveryList = ({ deliveries, onUpdateStatus, onRefresh }) => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: '',
    failureReason: ''
  });

  const handleStatusUpdate = (delivery) => {
    setSelectedDelivery(delivery);
    setStatusForm({
      status: delivery.deliveryStatus,
      notes: delivery.deliveryNotes || '',
      failureReason: delivery.failureReason || ''
    });
    setShowStatusModal(true);
  };

  const handleStatusSubmit = () => {
    onUpdateStatus(
      selectedDelivery._id,
      statusForm.status,
      statusForm.notes,
      statusForm.failureReason
    );
    setShowStatusModal(false);
    setSelectedDelivery(null);
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

  return (
    <div className="delivery-list">
      <div className="delivery-list-header">
        <h2>My Deliveries</h2>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>

      <div className="delivery-cards">
        {deliveries.length === 0 ? (
          <div className="no-deliveries">
            <p>No deliveries assigned to you at the moment.</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div key={delivery._id} className="delivery-card">
              <div className="delivery-card-header">
                <h3>Delivery #{delivery.deliveryID}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(delivery.deliveryStatus) }}
                >
                  {delivery.deliveryStatus}
                </span>
              </div>

              <div className="delivery-info">
                <div className="info-section">
                  <h4>Order Details</h4>
                  <p><strong>Order ID:</strong> {delivery.orderDetails.orderID}</p>
                  <p><strong>Customer:</strong> {delivery.orderDetails.customerID.customerName}</p>
                  <p><strong>Phone:</strong> {delivery.orderDetails.customerID.phone}</p>
                  <p><strong>Total Amount:</strong> LKR {delivery.orderDetails.totalAmount}</p>
                  <p><strong>Payment Method:</strong> {delivery.orderDetails.paymentMethod}</p>
                </div>

                <div className="info-section">
                  <h4>Delivery Details</h4>
                  <p><strong>Address:</strong> {delivery.orderDetails.deliveryAddress}</p>
                  <p><strong>Special Instructions:</strong> {delivery.orderDetails.specialInstructions || 'None'}</p>
                  <p><strong>Estimated Time:</strong> {formatDate(delivery.estimatedDeliveryTime)}</p>
                  {delivery.actualDeliveryTime && (
                    <p><strong>Actual Time:</strong> {formatDate(delivery.actualDeliveryTime)}</p>
                  )}
                </div>

                <div className="info-section">
                  <h4>Order Items</h4>
                  <ul className="order-items">
                    {delivery.orderDetails.orderItems.map((item, index) => (
                      <li key={index}>
                        {item.productID.productName} x {item.quantity} - LKR {item.subtotal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="delivery-actions">
                <button 
                  onClick={() => handleStatusUpdate(delivery)}
                  className="update-status-btn"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Delivery Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Delivery Notes</label>
                <textarea 
                  value={statusForm.notes}
                  onChange={(e) => setStatusForm({...statusForm, notes: e.target.value})}
                  placeholder="Add any notes about the delivery..."
                  rows="3"
                />
              </div>

              {statusForm.status === 'Failed' && (
                <div className="form-group">
                  <label>Failure Reason</label>
                  <select 
                    value={statusForm.failureReason}
                    onChange={(e) => setStatusForm({...statusForm, failureReason: e.target.value})}
                  >
                    <option value="">Select reason</option>
                    <option value="Customer Not Available">Customer Not Available</option>
                    <option value="Incorrect Address">Incorrect Address</option>
                    <option value="Customer Refused">Customer Refused</option>
                    <option value="Package Damaged">Package Damaged</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusSubmit}
                className="submit-btn"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;



