const mongoose = require("mongoose");

const customerAddressSchema = new mongoose.Schema({
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model("CustomerAddress", customerAddressSchema);
