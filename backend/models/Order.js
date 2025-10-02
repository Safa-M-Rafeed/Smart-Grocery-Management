const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: false
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD'],
    required: true
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  loyaltyDiscount: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['COMPLETED', 'CANCELLED', 'REFUNDED'],
    default: 'COMPLETED'
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
