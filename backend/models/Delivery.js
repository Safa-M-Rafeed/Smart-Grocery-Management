const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  deliveryID: { type: String, required: true, unique: true },
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  deliveryDate: { type: Date, required: true },
  deliveryStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }
});

module.exports = mongoose.model("Delivery", deliverySchema);
