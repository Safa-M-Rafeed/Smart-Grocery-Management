import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import axios from 'axios';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const categories = [
  'all',
  'fresh produce',
  'dairy',
  'bakery',
  'frozen goods',
  'household items',
  'beverages',
  'snacks',
  'meat & seafood',
  'canned goods',
  'health & beauty'
];

const statusFilters = [
  { value: 'all', label: 'All Products' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'expired', label: 'Expired' },
  { value: 'near-expiry', label: 'Near Expiry' }
];

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        [product.name, product.sku, product.category, product.supplier, product.batchNumber]
          .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((product) => {
        const now = new Date();
        const expiry = product.expiryDate ? new Date(product.expiryDate) : null;
        const daysUntilExpiry = expiry ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : null;
        switch (statusFilter) {
          case 'in-stock':
            return product.quantity > product.minThreshold;
          case 'low-stock':
            return product.quantity > 0 && product.quantity <= product.minThreshold;
          case 'out-of-stock':
            return product.quantity <= 0;
          case 'expired':
            return daysUntilExpiry !== null && daysUntilExpiry < 0;
          case 'near-expiry':
            return daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
          default:
            return true;
        }
      });
    }
    setFilteredProducts(filtered);
  };

  const handleFormClose = (shouldRefresh) => {
    setFormOpen(false);
    setSelectedProduct(null);
    if (shouldRefresh) fetchProducts();
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'SKU', 'Category', 'Price', 'Quantity', 'Min Threshold', 'Expiry Date', 'Supplier', 'Batch Number'],
      ...filteredProducts.map((p) => [
        p.name || '',
        p.sku || '',
        p.category || '',
        p.price || '',
        p.quantity || '',
        p.minThreshold || '',
        p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : '',
        p.supplier || '',
        p.batchNumber || ''
      ])
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <motion.div
      className="p-4 md:p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Inventory Management</h2>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 hover:bg-blue-50 transition text-sm"
          >
            <FunnelIcon className="h-5 w-5 mr-2" /> Filters
          </button>

          <button
            onClick={fetchProducts}
            className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 hover:bg-blue-50 transition text-sm"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" /> Refresh
          </button>

          <button
            onClick={exportData}
            className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 hover:bg-blue-50 transition text-sm"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Export
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-wrap gap-3 border-t pt-4"
            >
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {statusFilters.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
                className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
              >
                <XMarkIcon className="h-5 w-5 mr-1" /> Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
          {error} <button onClick={fetchProducts}>Retry</button>
        </div>
      )}

      {/* Table */}
      <ProductList products={filteredProducts} onEdit={(p) => setSelectedProduct(p)} />

      {/* Form */}
      <ProductForm open={formOpen} onClose={handleFormClose} selectedProduct={selectedProduct} />
    </motion.div>
  );
};

export default Inventory;
