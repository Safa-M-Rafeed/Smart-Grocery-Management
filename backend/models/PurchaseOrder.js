const mongoose = require('mongoose');

const poSchema = new mongoose.Schema({
  poNumber: { type: String, unique: true, required: true }, 
  supplier: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    quantityToOrder: { type: Number }
  }],
  status: { type: String, default: 'pending', enum: ['pending', 'sent', 'received', 'cancelled'] }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PurchaseOrder', poSchema);