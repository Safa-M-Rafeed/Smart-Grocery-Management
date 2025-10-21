const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date },
  category: { type: String, required: true }, // e.g., 'fresh produce', 'dairy'
  sku: { type: String, unique: true, required: true },
  supplier: { type: String },
  batchNumber: { type: String },
  minThreshold: { type: Number, default: 10 }, // For low-stock alerts
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);