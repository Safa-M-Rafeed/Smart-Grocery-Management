import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useState } from 'react';
import { PencilIcon, TrashIcon, ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon, CubeIcon, CurrencyDollarIcon, BuildingOfficeIcon, TagIcon, QrCodeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import ProductForm from './ProductForm'; // Import ProductForm for the edit popup

const ProductList = ({ products, onEdit: parentOnEdit }) => {
  const [editOpen, setEditOpen] = useState(false); // State to control edit modal
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the product being edited
  const [message, setMessage] = useState(''); // For success messages

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        if (parentOnEdit) {
          parentOnEdit(null, true); // Trigger refresh in parent
        }
        setMessage('Delete successful');
        setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please check the server connection or try again.');
      }
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the product to edit
    setEditOpen(true); // Open the popup
  };

  const handleFormClose = (shouldRefresh) => {
    setEditOpen(false); // Close the modal
    setSelectedProduct(null); // Clear selected product
    if (shouldRefresh && parentOnEdit) {
      parentOnEdit(null, true); // Trigger refresh in parent if changes were made
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined') return 'No expiry date';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid date';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'none', color: 'text-gray-500', icon: CalendarIcon, text: 'No expiry' };
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'text-red-500', icon: ExclamationCircleIcon, text: 'Expired' };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'near-expiry', color: 'text-yellow-500', icon: ExclamationTriangleIcon, text: `${daysUntilExpiry} days left` };
    } else {
      return { status: 'good', color: 'text-[#537D5D]', icon: CheckCircleIcon, text: 'Good' };
    }
  };

  const getStockStatus = (quantity, minThreshold) => {
    if (quantity <= 0) {
      return { status: 'out-of-stock', color: 'bg-red-100 text-red-500', text: 'Out of Stock' };
    } else if (quantity <= minThreshold) {
      return { status: 'low-stock', color: 'bg-yellow-100 text-yellow-500', text: 'Low Stock' };
    } else {
      return { status: 'in-stock', color: 'bg-green-100 text-[#537D5D]', text: 'In Stock' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!products) {
    return (
      <div className="rounded-lg mt-4 shadow-md overflow-hidden overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              {['Name', 'Price', 'Stock', 'Category', 'SKU', 'Supplier', 'Batch', 'Expiry', 'Actions'].map((header) => (
                <th key={header} className="p-2 font-semibold text-left">
                  <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                {[...Array(9)].map((_, cellIndex) => (
                  <td key={cellIndex} className="p-2">
                    <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-200 shadow-md mt-4">
        <CubeIcon className="h-16 w-16 mx-auto text-gray-500 opacity-70 mb-2" />
        <h5 className="text-xl font-medium text-gray-500">No products found</h5>
        <p className="text-gray-500">Start by adding your first product to the inventory or adjust your filters.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {message && (
        <div className="fixed top-4 right-4 bg-green-100 text-[#537D5D] px-4 py-2 rounded shadow-md z-50">
          {message}
        </div>
      )}
      <div className="rounded-lg mt-2 shadow-md border border-gray-200 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full min-w-max table-auto">
          <thead>
            <tr className="bg-gray-100">
              {['Name', 'Price', 'Stock', 'Category', 'SKU', 'Supplier', 'Batch', 'Expiry', 'Actions'].map((header) => (
                <th key={header} className="font-semibold text-text-primary py-3 px-4 text-left text-sm border-b-2 border-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const expiryStatus = getExpiryStatus(product.expiryDate);
              const stockStatus = getStockStatus(product.quantity, product.minThreshold);
              const ExpiryIcon = expiryStatus.icon;
              return (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`hover:bg-gray-50 cursor-pointer ${expiryStatus.status === 'expired' ? 'bg-red-50' : expiryStatus.status === 'near-expiry' ? 'bg-yellow-50' : stockStatus.status === 'low-stock' ? 'bg-yellow-50' : ''} transition-colors`}
                >
                  <td className="py-3 px-4 font-semibold text-sm md:text-base">{product.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-500 opacity-70" />
                      <span className="text-[#537D5D] text-sm">{formatCurrency(product.price)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <CubeIcon className="h-4 w-4 text-gray-500 opacity-70" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color} shadow-sm`}>{`${product.quantity} (Min: ${product.minThreshold})`}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-gray-500 opacity-70" />
                      <span className="capitalize text-sm">{product.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <QrCodeIcon className="h-4 w-4 text-gray-500 opacity-70" />
                      <span className="font-mono text-sm">{product.sku}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-500 opacity-70" />
                      <span className="text-sm">{product.supplier || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{product.batchNumber || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <ExpiryIcon className={`h-4 w-4 ${expiryStatus.color}`} />
                      <span className={`text-sm ${expiryStatus.status === 'expired' ? 'text-red-500' : expiryStatus.status === 'near-expiry' ? 'text-yellow-500' : 'text-text-primary'}`}>
                        {formatDate(product.expiryDate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-1 text-[#537D5D] hover:bg-green-50 rounded shadow-sm"
                        aria-label="Edit product"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded shadow-sm"
                        aria-label="Delete product"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Popup using ProductForm */}
      <ProductForm open={editOpen} onClose={handleFormClose} selectedProduct={selectedProduct} />
    </motion.div>
  );
};

export default ProductList;