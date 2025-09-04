const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  paymentMethod: { type: String, required: true, enum: ["Cash", "Card", "Loan"] }
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
