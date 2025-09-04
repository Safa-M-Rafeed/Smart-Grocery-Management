const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentID: { type: String, required: true, unique: true },
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  payAmount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  invoiceNo: { type: String, required: true },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true }
});

module.exports = mongoose.model("Payment", paymentSchema);
