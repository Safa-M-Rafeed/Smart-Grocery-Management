import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Download,
  Eye,
  Plus,
  Filter,
} from "lucide-react";

const LoanLoyaltyManagement = () => {
  const [loyaltyTransactions, setLoyaltyTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchLoyaltyTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, loyaltyTransactions, filterType]);

  const fetchLoyaltyTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/loyalty", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch loyalty transactions");
      }

      const data = await response.json();
      setLoyaltyTransactions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = loyaltyTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.customerID?.customerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.transactionID
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.customerID?.phone?.includes(searchTerm);

      const matchesFilter =
        filterType === "all" ||
        (filterType === "earned" && transaction.pointsEarned > 0) ||
        (filterType === "redeemed" && transaction.pointsRedeemed > 0);

      return matchesSearch && matchesFilter;
    });

    setFilteredTransactions(filtered);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/loyalty/${editingTransaction._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pointsEarned: editingTransaction.pointsEarned,
            pointsRedeemed: editingTransaction.pointsRedeemed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      await fetchLoyaltyTransactions();
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/loyalty/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      await fetchLoyaltyTransactions();
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadReport = () => {
    const csvContent = [
      [
        "Transaction ID",
        "Customer Name",
        "Phone",
        "Points Earned",
        "Points Redeemed",
        "Date",
      ],
      ...filteredTransactions.map((transaction) => [
        transaction.transactionID,
        transaction.customerID?.customerName || "N/A",
        transaction.customerID?.phone || "N/A",
        transaction.pointsEarned,
        transaction.pointsRedeemed,
        new Date(transaction.date).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loyalty-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading loyalty transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Loyalty Management
          </h1>
          <p className="text-gray-600">
            Manage customer loyalty transactions and points
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by customer name, phone, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1 focus:border-transparent"
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
                <option value="all">All Transactions</option>
                <option value="earned">Points Earned</option>
                <option value="redeemed">Points Redeemed</option>
              </select>
            </div>

            {/* Download Report */}
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Download size={20} />
              Download Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              Total Transactions
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {loyaltyTransactions.length}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              Total Points Earned
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {loyaltyTransactions.reduce((sum, t) => sum + t.pointsEarned, 0)}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              Total Points Redeemed
            </h3>
            <p className="text-2xl font-bold text-red-600">
              {loyaltyTransactions.reduce(
                (sum, t) => sum + t.pointsRedeemed,
                0
              )}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              Filtered Results
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {filteredTransactions.length}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Points Earned
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Points Redeemed
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {transaction.transactionID}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {transaction.customerID?.customerName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {transaction.customerID?.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600 whitespace-nowrap">
                      +{transaction.pointsEarned}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600 whitespace-nowrap">
                      -{transaction.pointsRedeemed}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="p-1 text-red-600 hover:text-red-900"
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

          {filteredTransactions.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No loyalty transactions found</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editingTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
              <h3 className="mb-4 text-lg font-semibold">
                Edit Loyalty Transaction
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={editingTransaction.transactionID}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Points Earned
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingTransaction.pointsEarned}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        pointsEarned: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Points Redeemed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingTransaction.pointsRedeemed}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        pointsRedeemed: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary1"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTransaction(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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

export default LoanLoyaltyManagement;
