const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  poID: { type: String, required: true, unique: true },
  supplierID: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" }
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
