const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" }
});

module.exports = mongoose.model("Order", orderSchema);
