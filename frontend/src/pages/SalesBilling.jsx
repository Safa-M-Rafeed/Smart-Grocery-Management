import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Download, Eye, Filter, Receipt, DollarSign } from 'lucide-react';

const SalesBilling = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingOrder, setEditingOrder] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchTerm, orders, filterType]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/orders', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = orders.filter(order => {
            const matchesSearch = 
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerID?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerID?.phone?.includes(searchTerm) ||
                order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filterType === 'all' || 
                (filterType === 'cash' && order.paymentMethod === 'CASH') ||
                (filterType === 'card' && order.paymentMethod === 'CARD') ||
                (filterType === 'completed' && order.status === 'COMPLETED') ||
                (filterType === 'cancelled' && order.status === 'CANCELLED');

            return matchesSearch && matchesFilter;
        });

        setFilteredOrders(filtered);
    };

    const handleEdit = (order) => {
        setEditingOrder({ ...order });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/orders/${editingOrder._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    totalAmount: editingOrder.totalAmount,
                    paymentMethod: editingOrder.paymentMethod,
                    status: editingOrder.status,
                    loyaltyPointsUsed: editingOrder.loyaltyPointsUsed,
                    loyaltyDiscount: editingOrder.loyaltyDiscount
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            await fetchOrders();
            setShowEditModal(false);
            setEditingOrder(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            await fetchOrders();
        } catch (error) {
            setError(error.message);
        }
    };

    const downloadReport = () => {
        const csvContent = [
            ['Order ID', 'Customer Name', 'Phone', 'Total Amount', 'Payment Method', 'Status', 'Loyalty Discount', 'Date'],
            ...filteredOrders.map(order => [
                order._id,
                order.customerID?.customerName || 'Guest',
                order.customerID?.phone || 'N/A',
                order.totalAmount,
                order.paymentMethod,
                order.status,
                order.loyaltyDiscount || 0,
                new Date(order.date).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading orders...</div>
            </div>
        );
    }

    const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalDiscount = filteredOrders.reduce((sum, order) => sum + (order.loyaltyDiscount || 0), 0);

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales & Billing</h1>
                    <p className="text-gray-600">Manage orders, sales, and billing information</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by order ID, customer name, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-transparent"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-500" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                            >
                                <option value="all">All Orders</option>
                                <option value="cash">Cash Payment</option>
                                <option value="card">Card Payment</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Download Report */}
                        <button
                            onClick={downloadReport}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download size={20} />
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <Receipt className="text-blue-500 mr-3" size={24} />
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <DollarSign className="text-green-500 mr-3" size={24} />
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                                <p className="text-2xl font-bold text-green-600">LKR {totalSales.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Total Discounts</h3>
                        <p className="text-2xl font-bold text-red-600">LKR {totalDiscount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Filtered Results</h3>
                        <p className="text-2xl font-bold text-blue-600">{filteredOrders.length}</p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.customerID?.customerName || 'Guest'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.customerID?.phone || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            LKR {order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                order.paymentMethod === 'CASH' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                order.status === 'COMPLETED' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : order.status === 'CANCELLED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(order)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order._id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {showEditModal && editingOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Edit Order</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Order ID
                                    </label>
                                    <input
                                        type="text"
                                        value={editingOrder._id}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Amount (LKR)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingOrder.totalAmount}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            totalAmount: parseFloat(e.target.value) || 0
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={editingOrder.paymentMethod}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            paymentMethod: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="CARD">Card</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={editingOrder.status}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            status: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                    >
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                        <option value="REFUNDED">Refunded</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Loyalty Discount (LKR)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingOrder.loyaltyDiscount || 0}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            loyaltyDiscount: parseFloat(e.target.value) || 0
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingOrder(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesBilling;
