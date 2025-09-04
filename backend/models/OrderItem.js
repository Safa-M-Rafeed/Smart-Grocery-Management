const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
