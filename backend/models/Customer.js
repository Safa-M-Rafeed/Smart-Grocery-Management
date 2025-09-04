const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
