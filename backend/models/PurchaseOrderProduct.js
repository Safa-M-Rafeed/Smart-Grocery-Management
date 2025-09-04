const mongoose = require("mongoose");

const purchaseOrderProductSchema = new mongoose.Schema({
  poID: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
  productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
});

module.exports = mongoose.model("PurchaseOrderProduct", purchaseOrderProductSchema);
