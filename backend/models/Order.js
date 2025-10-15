const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  orderDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ["Pending", "Processing", "Ready for Delivery", "Completed", "Cancelled"], 
    default: "Pending" 
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  paymentMethod: { type: String, enum: ["Cash on Delivery", "Online Payment"], required: true },
  deliveryAddress: { type: String, required: true },
  specialInstructions: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create unique index explicitly
orderSchema.index({ orderID: 1 }, { unique: true });

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Order", orderSchema);
