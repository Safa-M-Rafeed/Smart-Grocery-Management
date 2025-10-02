import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Calculator,
  Phone,
  Gift,
  X,
  User,
  Mail,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CashierDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Loyalty card states
  const [showLoyaltyCheck, setShowLoyaltyCheck] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [showEmailCheckModal, setShowEmailCheckModal] = useState(false); // New state for email check
  const [customerEmail, setCustomerEmail] = useState(""); // New state for email
  const [existingCustomer, setExistingCustomer] = useState(null); // Existing customer without loyalty card
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [newCustomerData, setNewCustomerData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Search products when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchProducts();
    } else {
      fetchProducts();
    }
  }, [searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/products/search?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Failed to search products");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item._id === product._id);

    if (existingItem) {
      if (existingItem.quantity < product.quantityInStock) {
        setCartItems(
          cartItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p._id === productId);

    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= product.quantityInStock) {
      setCartItems(
        cartItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomer(null);
    setLoyaltyDiscount(0);
    setPointsToRedeem(0);
    setShowLoyaltyCheck(false);
  };

  // Loyalty card functions
  const checkCustomerByPhone = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/customers/check-phone?phone=${encodeURIComponent(
          phoneNumber
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setCustomer(data.customer);
          setShowLoyaltyCheck(false); // Close loyalty check modal
          setError("");
        } else {
          setCustomer(null);
          setShowLoyaltyCheck(false);
          setShowCreateOfferModal(true); // Show create offer modal
        }
      } else {
        setError("Failed to check customer");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  // Check customer by email
  const checkCustomerByEmail = async () => {
    if (!customerEmail.trim()) {
      setError("Please enter an email address");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/customers/check-email?email=${encodeURIComponent(
          customerEmail
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          if (data.hasLoyaltyCard) {
            // Customer already has loyalty card
            setError("This customer already has a loyalty card");
            return;
          } else {
            // Customer exists but no loyalty card - add phone number
            setExistingCustomer(data.customer);
            setShowEmailCheckModal(false);
            setShowCreateModal(true);
          }
        } else {
          // Customer doesn't exist - create new customer with loyalty card
          setExistingCustomer(null);
          setShowEmailCheckModal(false);
          setShowCreateModal(true);
        }
        setError("");
      } else {
        setError("Failed to check customer email");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const createLoyaltyCard = async () => {
    try {
      const token = localStorage.getItem("token");

      // Validate required fields
      if (!phoneNumber.trim()) {
        setError("Phone number is required for loyalty card creation");
        return;
      }

      if (!customerEmail.trim()) {
        setError("Email is required");
        return;
      }

      if (existingCustomer) {
        // Add phone to existing customer for loyalty card
        const response = await fetch("http://localhost:4000/api/customers/add-phone", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: customerEmail.trim(),
            phone: phoneNumber.trim(),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Create loyalty transaction for card activation
          const loyaltyResponse = await fetch("http://localhost:4000/api/loyalty", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerID: data.customer._id,
              transactionType: 'CARD_CREATED',
              pointsEarned: 0,
              pointsRedeemed: 0
            }),
          });

          if (loyaltyResponse.ok) {
            const loyaltyData = await loyaltyResponse.json();
            setCustomer(data.customer);
            resetLoyaltyModals();

            alert(`Loyalty card activated successfully for existing customer!
                   Customer: ${data.customer.customerName}
                   Email: ${data.customer.email}
                   Phone: ${data.customer.phone}
                   Transaction ID: ${loyaltyData.transaction.transactionID}`);
          } else {
            setError("Phone added but failed to create loyalty transaction");
          }
        } else {
          setError(data.message || "Failed to add phone number to customer");
        }
      } else {
        // Create new customer with loyalty card
        if (!newCustomerData.customerName) {
          setError("Please enter customer name for new customer");
          return;
        }

        const customerResponse = await fetch("http://localhost:4000/api/customers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: newCustomerData.customerName,
            email: customerEmail.trim(),
            phone: phoneNumber.trim(),
            address: newCustomerData.address,
          }),
        });

        const customerData = await customerResponse.json();

        if (customerResponse.ok) {
          // Create loyalty transaction for new card
          const loyaltyResponse = await fetch("http://localhost:4000/api/loyalty", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerID: customerData.customer._id,
              transactionType: 'CARD_CREATED',
              pointsEarned: 0,
              pointsRedeemed: 0
            }),
          });

          if (loyaltyResponse.ok) {
            const loyaltyData = await loyaltyResponse.json();
            setCustomer(customerData.customer);
            resetLoyaltyModals();

            alert(`New customer and loyalty card created successfully!
                   Customer: ${customerData.customer.customerName}
                   Email: ${customerData.customer.email}
                   Phone: ${customerData.customer.phone}
                   Transaction ID: ${loyaltyData.transaction.transactionID}`);
          } else {
            setError("Customer created but failed to create loyalty transaction");
          }
        } else {
          setError(customerData.message || "Failed to create customer");
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const resetLoyaltyModals = () => {
    setShowCreateModal(false);
    setShowEmailCheckModal(false);
    setShowCreateOfferModal(false);
    setNewCustomerData({
      customerName: "",
      email: "",
      phone: "",
      address: "",
    });
    setCustomerEmail("");
    setExistingCustomer(null);
    setPhoneNumber("");
    setError("");
  };

  const applyLoyaltyDiscount = () => {
    if (pointsToRedeem > customer.loyaltyPoints) {
      setError("Cannot redeem more points than available");
      return;
    }

    const total = calculateTotal();
    if (pointsToRedeem > total) {
      setError("Cannot redeem more points than total amount");
      return;
    }

    setLoyaltyDiscount(pointsToRedeem);
    setError("");
  };

  const getFinalTotal = () => {
    return calculateTotal() - loyaltyDiscount;
  };

  const getPointsToEarn = () => {
    return Math.floor(getFinalTotal() / 100);
  };

  const formatDate = (date) => {
    if (!date) return "No expiry";
    return new Date(date).toLocaleDateString();
  };

  const proceedToPayment = () => {
    if (cartItems.length === 0) {
      setError("Cart is empty");
      return;
    }
    // Only show loyalty check when proceeding to payment
    setShowLoyaltyCheck(true);
  };

  const processPayment = async () => {
    if (cartItems.length === 0) {
      setError("Cart is empty");
      return;
    }

    // Prepare order data
    const orderData = {
      cartItems,
      customer,
      loyaltyDiscount,
      pointsToRedeem,
      subtotal: calculateTotal(),
      finalTotal: getFinalTotal(),
      pointsToEarn: getPointsToEarn()
    };

    // Store order data in sessionStorage for OrderPayment page
    sessionStorage.setItem("orderData", JSON.stringify(orderData));

    // Navigate to payment page
    navigate("/order-payment");
  };

  // Continue without loyalty card - show offer to create new card
  const continueWithoutCard = () => {
    setShowLoyaltyCheck(false);
    setShowCreateOfferModal(true);
  };

  // Accept creating loyalty card - show email check modal
  const acceptCreateCard = () => {
    setShowCreateOfferModal(false);
    setShowEmailCheckModal(true);
  };

  // Decline creating loyalty card and proceed to payment
  const declineCreateCard = () => {
    setShowCreateOfferModal(false);
    processPayment();
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
          <h1 className="mb-4 text-3xl font-bold text-primary1">
            Cashier Dashboard
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search
              className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Products
              </h2>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-primary1"></div>
                  <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 xl:grid-cols-3 max-h-96">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md"
                    >
                      <h3 className="mb-2 font-medium text-gray-800">
                        {product.productName}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Price: LKR {product.price.toFixed(2)}</p>
                        <p>Stock: {product.quantityInStock}</p>
                        <p>Category: {product.category}</p>
                        <p>Expiry: {formatDate(product.expiryDate)}</p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.quantityInStock === 0}
                        className="w-full py-2 mt-3 text-white transition-colors rounded-lg bg-primary1 hover:bg-primary2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {product.quantityInStock === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white rounded-lg shadow-sm top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-xl font-semibold text-gray-800">
                  <ShoppingCart className="mr-2" size={20} />
                  Cart ({cartItems.length})
                </h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 transition-colors hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 overflow-y-auto max-h-64">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="p-1 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-medium min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.quantityInStock}
                              className="p-1 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              LKR {item.price.toFixed(2)} each
                            </p>
                            <p className="font-medium">
                              LKR {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Info */}
                  {customer && (
                    <div className="p-3 border rounded-lg bg-primary4/20 border-primary3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="flex items-center font-medium text-primary1">
                          <Gift className="mr-2" size={16} />
                          Loyalty Customer
                        </h4>
                        <button
                          onClick={() => {
                            setCustomer(null);
                            setLoyaltyDiscount(0);
                            setPointsToRedeem(0);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700">
                        {customer.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Points: {customer.loyaltyPoints}
                      </p>

                      {customer.loyaltyPoints > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              placeholder="Points to redeem"
                              value={pointsToRedeem}
                              onChange={(e) =>
                                setPointsToRedeem(parseInt(e.target.value) || 0)
                              }
                              max={Math.min(
                                customer.loyaltyPoints,
                                calculateTotal()
                              )}
                              className="flex-1 px-2 py-1 text-sm border rounded"
                            />
                            <button
                              onClick={applyLoyaltyDiscount}
                              className="px-3 py-1 text-sm text-white rounded bg-primary1 hover:bg-primary2"
                            >
                              Apply
                            </button>
                          </div>
                          {loyaltyDiscount > 0 && (
                            <p className="text-sm text-green-600">
                              Discount: LKR {loyaltyDiscount.toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total Section */}
                  <div className="pt-4 border-t">
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>LKR {calculateTotal().toFixed(2)}</span>
                      </div>
                      {loyaltyDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Loyalty Discount:</span>
                          <span>-LKR {loyaltyDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="flex items-center text-lg font-semibold">
                          <Calculator className="mr-2" size={20} />
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-primary1">
                          LKR {getFinalTotal().toFixed(2)}
                        </span>
                      </div>
                      {customer && (
                        <p className="text-sm text-gray-600">
                          Points to earn: {getPointsToEarn()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={proceedToPayment}
                      className="w-full py-3 font-medium text-white transition-colors rounded-lg bg-primary1 hover:bg-primary2"
                    >
                      Process Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loyalty Check Modal */}
        {showLoyaltyCheck && !customer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Loyalty Card Check
                </h3>
                <button
                  onClick={() => setShowLoyaltyCheck(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-4 text-gray-600">
                Enter customer's phone number to check for existing loyalty card:
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                    />
                    <button
                      onClick={checkCustomerByPhone}
                      className="px-4 py-2 text-white rounded-lg bg-primary1 hover:bg-primary2"
                    >
                      <Phone size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={continueWithoutCard}
                    className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    No Loyalty Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Loyalty Card Offer Modal */}
        {showCreateOfferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center text-lg font-semibold text-gray-800">
                  <Gift className="mr-2 text-primary1" size={20} />
                  Create Loyalty Card?
                </h3>
                <button
                  onClick={() => setShowCreateOfferModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-gray-600">
                  Would you like to create a loyalty card for this customer?
                </p>
                <div className="p-3 rounded-lg bg-primary4/20">
                  <h4 className="mb-2 font-medium text-primary1">Benefits:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Earn 1 point for every LKR 100 spent</li>
                    <li>• Redeem points for discounts (1 point = LKR 1)</li>
                    <li>• Track purchase history</li>
                    <li>• Special offers and promotions</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={acceptCreateCard}
                  className="w-full px-4 py-3 text-white transition-colors rounded-lg bg-primary1 hover:bg-primary2"
                >
                  Yes, Create Loyalty Card
                </button>
                <button
                  onClick={declineCreateCard}
                  className="w-full px-4 py-3 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  No, Continue Without Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Process Payment Modal when customer found */}
        {showLoyaltyCheck && customer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center text-lg font-semibold text-gray-800">
                  <Gift className="mr-2 text-primary1" size={20} />
                  Loyalty Customer Found
                </h3>
                <button
                  onClick={() => setShowLoyaltyCheck(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-3 mb-4 rounded-lg bg-primary4/20">
                <p className="font-medium text-primary1">{customer.customerName}</p>
                <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
                <p className="text-sm text-gray-600">Available Points: {customer.loyaltyPoints}</p>
              </div>

              {customer.loyaltyPoints > 0 && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Redeem Points (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Points to redeem"
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                      max={Math.min(customer.loyaltyPoints, calculateTotal())}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={applyLoyaltyDiscount}
                      className="px-3 py-2 text-sm text-white rounded-lg bg-primary1 hover:bg-primary2"
                    >
                      Apply
                    </button>
                  </div>
                  {loyaltyDiscount > 0 && (
                    <p className="mt-2 text-sm text-green-600">
                      Discount Applied: LKR {loyaltyDiscount.toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <div className="p-3 mb-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Final Total:</span>
                  <span className="text-xl font-bold text-primary1">LKR {getFinalTotal().toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600">Points to earn: {getPointsToEarn()}</p>
              </div>

              <button
                onClick={processPayment}
                className="w-full px-4 py-3 text-white transition-colors rounded-lg bg-primary1 hover:bg-primary2"
              >
                Process Payment
              </button>
            </div>
          </div>
        )}

        {/* Create Loyalty Card Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {existingCustomer ? "Add Loyalty Card to Existing Customer" : "Create New Customer with Loyalty Card"}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {existingCustomer && (
                <div className="p-3 mb-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-800">Existing Customer Found:</h4>
                  <p className="text-sm text-green-700">{existingCustomer.customerName}</p>
                  <p className="text-sm text-green-700">{existingCustomer.email}</p>
                  <p className="mt-1 text-xs text-green-600">Adding phone number to activate loyalty card</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Mail className="inline mr-1" size={16} />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                    placeholder="Customer email"
                    disabled
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Phone className="inline mr-1" size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                    placeholder="Enter phone number for loyalty card"
                    required
                  />
                </div>

                {!existingCustomer && (
                  <>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        <User className="inline mr-1" size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newCustomerData.customerName}
                        onChange={(e) =>
                          setNewCustomerData({
                            ...newCustomerData,
                            customerName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        <MapPin className="inline mr-1" size={16} />
                        Address (Optional)
                      </label>
                      <textarea
                        value={newCustomerData.address}
                        onChange={(e) =>
                          setNewCustomerData({
                            ...newCustomerData,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                        placeholder="Enter address"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEmailCheckModal(true);
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={createLoyaltyCard}
                    disabled={!phoneNumber.trim() || !customerEmail.trim() || (!existingCustomer && !newCustomerData.customerName)}
                    className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary1 hover:bg-primary2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {existingCustomer ? "Activate Loyalty Card" : "Create Customer & Card"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Check Modal - Add this modal that's missing */}
        {showEmailCheckModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Customer Email Check
                </h3>
                <button
                  onClick={() => setShowEmailCheckModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-4 text-gray-600">
                Enter customer's email to check if they exist in the system:
              </p>

              <div className="p-3 mb-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="text-sm font-medium text-blue-800">Process:</p>
                <ul className="mt-1 space-y-1 text-xs text-blue-700">
                  <li>• If email exists but no phone: Add phone for loyalty card</li>
                  <li>• If email doesn't exist: Create new customer with loyalty card</li>
                  <li>• If email has loyalty card: Cannot proceed</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Mail className="inline mr-1" size={16} />
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter customer email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowEmailCheckModal(false);
                      setShowCreateOfferModal(true);
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={checkCustomerByEmail}
                    disabled={!customerEmail.trim()}
                    className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary1 hover:bg-primary2 disabled:opacity-50"
                  >
                    Check Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashierDashboard;

