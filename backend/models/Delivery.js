const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  deliveryID: { type: String, required: true },
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  deliveryDate: { type: Date, required: true },
  deliveryStatus: { 
    type: String, 
    enum: ["Pending", "In Transit", "Delivered", "Failed"], 
    default: "Pending" 
  },
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  deliveryNotes: { type: String },
  failureReason: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create unique index explicitly
deliverySchema.index({ deliveryID: 1 }, { unique: true });

deliverySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Delivery", deliverySchema);
