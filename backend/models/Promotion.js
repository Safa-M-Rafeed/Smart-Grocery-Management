const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  discountRate: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  description: { type: String },
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
});

module.exports = mongoose.model("Promotion", promotionSchema);
