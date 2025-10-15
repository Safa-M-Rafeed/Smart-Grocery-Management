import React, { useState } from 'react';
import './ShoppingCart.css';

const ShoppingCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return `LKR ${price.toFixed(2)}`;
  };

  return (
    <>
      {/* Cart Button */}
      <button 
        className="cart-button"
        onClick={() => setIsOpen(true)}
      >
        🛒 Cart ({calculateItemCount()})
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <p>Add some products to get started!</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div key={item._id} className="cart-item">
                        <div className="item-info">
                          <h4>{item.productName}</h4>
                          <p className="item-category">{item.category}</p>
                          <p className="item-price">{formatPrice(item.price)} each</p>
                        </div>

                        <div className="item-controls">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="quantity-btn"
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= item.quantityInStock}
                              className="quantity-btn"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => onRemoveItem(item._id)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Fee:</span>
                      <span>LKR 200.00</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{formatPrice(calculateTotal() + 200)}</span>
                    </div>
                  </div>

                  <div className="cart-actions">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="continue-shopping-btn"
                    >
                      Continue Shopping
                    </button>
                    <button 
                      onClick={() => {
                        onProceedToCheckout();
                        setIsOpen(false);
                      }}
                      className="checkout-btn"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;



