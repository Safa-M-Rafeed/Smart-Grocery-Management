const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  expiryDate: { type: Date },
  price: { type: Number, required: true },
  quantityInStock: { type: Number, required: true },
  category: { type: String },
  supplierID: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }
});

module.exports = mongoose.model("Product", productSchema);
