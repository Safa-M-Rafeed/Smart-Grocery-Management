import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DeliveryMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DeliveryMap = ({ deliveries, onUpdateStatus }) => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: '',
    failureReason: ''
  });

  // Default center coordinates (Colombo, Sri Lanka)
  const defaultCenter = [6.9271, 79.8612];
  const defaultZoom = 11;

  const handleMarkerClick = (delivery) => {
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

  const getMarkerColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'In Transit': return '#3498db';
      case 'Delivered': return '#27ae60';
      case 'Failed': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="delivery-map-container">
      <div className="map-header">
        <h2>Delivery Map - Sri Lanka</h2>
        <p>Click on markers to view delivery details and update status</p>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f39c12' }}></div>
          <span>Pending</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3498db' }}></div>
          <span>In Transit</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#27ae60' }}></div>
          <span>Delivered</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
          <span>Failed</span>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {deliveries.map((delivery) => {
            if (delivery.latitude && delivery.longitude) {
              return (
                <Marker
                  key={delivery._id}
                  position={[delivery.latitude, delivery.longitude]}
                  icon={createCustomIcon(getMarkerColor(delivery.deliveryStatus))}
                  eventHandlers={{
                    click: () => handleMarkerClick(delivery)
                  }}
                >
                  <Popup>
                    <div className="delivery-popup">
                      <h4>Delivery #{delivery.deliveryID}</h4>
                      <p><strong>Status:</strong> {delivery.deliveryStatus}</p>
                      <p><strong>Customer:</strong> {delivery.orderDetails.customerID.customerName}</p>
                      <p><strong>Address:</strong> {delivery.orderDetails.deliveryAddress}</p>
                      <p><strong>Payment Method:</strong> {delivery.orderDetails.paymentMethod}</p>
                      <p><strong>Total Amount:</strong> LKR {delivery.orderDetails.totalAmount}</p>
                      <p><strong>Estimated Time:</strong> {formatDate(delivery.estimatedDeliveryTime)}</p>
                      <button 
                        onClick={() => handleMarkerClick(delivery)}
                        className="popup-btn"
                      >
                        Update Status
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedDelivery && (
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
              <div className="delivery-summary">
                <h4>Delivery #{selectedDelivery.deliveryID}</h4>
                <p><strong>Customer:</strong> {selectedDelivery.orderDetails.customerID.customerName}</p>
                <p><strong>Address:</strong> {selectedDelivery.orderDetails.deliveryAddress}</p>
                <p><strong>Payment Method:</strong> {selectedDelivery.orderDetails.paymentMethod}</p>
                <p><strong>Total Amount:</strong> LKR {selectedDelivery.orderDetails.totalAmount}</p>
                <p><strong>Current Status:</strong> {selectedDelivery.deliveryStatus}</p>
              </div>

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

export default DeliveryMap;



