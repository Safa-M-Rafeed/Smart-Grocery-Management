import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { XMarkIcon, CurrencyDollarIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

const categories = [
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

const ProductForm = ({ open, onClose, selectedProduct }) => {
  const [formData, setFormData] = useState({
    name: '', 
    price: '', 
    quantity: '', 
    expiryDate: '', 
    category: '', 
    sku: '', 
    supplier: '', 
    batchNumber: '', 
    minThreshold: 10
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // New state for success message

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        ...selectedProduct,
        expiryDate: selectedProduct.expiryDate 
          ? new Date(selectedProduct.expiryDate).toISOString().split('T')[0] 
          : '',
        price: selectedProduct.price || '',
        quantity: selectedProduct.quantity || '',
        minThreshold: selectedProduct.minThreshold || 10
      });
    } else {
      setFormData({ 
        name: '', 
        price: '', 
        quantity: '', 
        expiryDate: '', 
        category: '', 
        sku: '', 
        supplier: '', 
        batchNumber: '', 
        minThreshold: 10 
      });
    }
    setErrors({});
    setMessage(''); // Clear message on open
  }, [selectedProduct, open]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    // Add your validation logic here (from original code)
    return newErrors;
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(validateField(name, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedProduct) {
        await axios.put(`http://localhost:5000/api/products/${selectedProduct._id}`, formData);
        setMessage('Update successful'); // Set success message for edit
      } else {
        await axios.post('http://localhost:5000/api/products', formData);
        setMessage('Product added successfully'); // Set success message for add
      }
      setTimeout(() => {
        setMessage(''); // Clear message after 2 seconds
        onClose(true); // Refresh parent component
      }, 2000);
    } catch (err) {
      console.error('Submit error:', err);
      setErrors({ submit: 'Failed to save product' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4 sm:px-0"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl p-6 sm:p-8 relative overflow-auto max-h-[90vh] mx-auto">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#537D5D] to-[#3f6343] bg-clip-text text-transparent">
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            {message && (
              <div className="fixed top-4 right-4 bg-green-100 text-[#537D5D] px-4 py-2 rounded shadow-md z-50">
                {message}
              </div>
            )}

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white shadow-md">
                <h3 className="font-semibold mb-4 text-lg">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                    required
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  <input
                    name="sku"
                    type="text"
                    placeholder="SKU"
                    value={formData.sku}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                  />
                  <input
                    name="supplier"
                    type="text"
                    placeholder="Supplier"
                    value={formData.supplier}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white shadow-md">
                <h3 className="font-semibold mb-4 text-lg">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      placeholder="Price (LKR)"
                      value={formData.price}
                      onChange={handleNumberInput}
                      className="border rounded-lg p-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] pl-10"
                      required
                    />
                    <CurrencyDollarIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  <input
                    name="quantity"
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                    required
                  />
                  <input
                    name="minThreshold"
                    type="number"
                    placeholder="Min Threshold"
                    value={formData.minThreshold}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white shadow-md">
                <h3 className="font-semibold mb-4 text-lg">Additional Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="expiryDate"
                    type="date"
                    placeholder="Expiry Date"
                    value={formData.expiryDate}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                  />
                  <input
                    name="batchNumber"
                    type="text"
                    placeholder="Batch Number"
                    value={formData.batchNumber}
                    onChange={handleNumberInput}
                    className="border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#537D5D] w-full"
                  />
                </div>
              </div>
            </div>

            {errors.submit && <p className="text-red-500 mt-4 text-center">{errors.submit}</p>}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button onClick={onClose} disabled={loading} className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg p-3 text-base flex-1 shadow-md transition-all">
                <XCircleIcon className="h-5 w-5 mr-2" /> Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading} className="flex items-center justify-center bg-gradient-to-r from-[#537D5D] to-[#3f6343] text-white rounded-lg p-3 text-base flex-1 hover:opacity-90 shadow-md transition-all">
                <CheckIcon className="h-5 w-5 mr-2" /> {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductForm;