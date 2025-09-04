const mongoose = require("mongoose");

const deliveryFailureSchema = new mongoose.Schema({
  failureID: { type: String, required: true, unique: true },
  deliveryID: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery", required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DeliveryFailure", deliveryFailureSchema);
