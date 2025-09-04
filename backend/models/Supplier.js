const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model("Supplier", supplierSchema);
