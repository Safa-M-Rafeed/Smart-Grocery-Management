import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, ShoppingCart, Trash2, Calculator } from 'lucide-react';

const CashierDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                setError('Failed to fetch products');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/products/search?query=${encodeURIComponent(searchQuery)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                setError('Failed to search products');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item._id === product._id);

        if (existingItem) {
            if (existingItem.quantity < product.quantityInStock) {
                setCartItems(cartItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            }
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        const product = products.find(p => p._id === productId);

        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= product.quantityInStock) {
            setCartItems(cartItems.map(item =>
                item._id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item._id !== productId));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const formatDate = (date) => {
        if (!date) return 'No expiry';
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-primary1 mb-4">Cashier Dashboard</h1>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-transparent"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary1 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Loading products...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                    {products.map((product) => (
                                        <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <h3 className="font-medium text-gray-800 mb-2">{product.productName}</h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Price: LKR {product.price.toFixed(2)}</p>
                                                <p>Stock: {product.quantityInStock}</p>
                                                <p>Category: {product.category}</p>
                                                <p>Expiry: {formatDate(product.expiryDate)}</p>
                                            </div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={product.quantityInStock === 0}
                                                className="w-full mt-3 bg-primary1 text-white py-2 rounded-lg hover:bg-primary2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {product.quantityInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <ShoppingCart className="mr-2" size={20} />
                                    Cart ({cartItems.length})
                                </h2>
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Cart is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="max-h-64 overflow-y-auto space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item._id} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-sm">{item.productName}</h4>
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
                                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                            className="bg-gray-200 text-gray-700 rounded-full p-1 hover:bg-gray-300"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-medium min-w-[30px] text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                            disabled={item.quantity >= item.quantityInStock}
                                                            className="bg-gray-200 text-gray-700 rounded-full p-1 hover:bg-gray-300 disabled:opacity-50"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">LKR {item.price.toFixed(2)} each</p>
                                                        <p className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Section */}
                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-lg font-semibold flex items-center">
                                                <Calculator className="mr-2" size={20} />
                                                Total:
                                            </span>
                                            <span className="text-2xl font-bold text-primary1">
                                                LKR {calculateTotal().toFixed(2)}
                                            </span>
                                        </div>

                                        <button className="w-full bg-primary1 text-white py-3 rounded-lg hover:bg-primary2 transition-colors font-medium">
                                            Process Payment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashierDashboard;
