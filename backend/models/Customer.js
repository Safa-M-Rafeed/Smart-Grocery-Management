const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true }, // Remove unique constraint from email
  phone: { type: String, required: true, unique: true }, // Phone number must be unique for loyalty cards
  loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
