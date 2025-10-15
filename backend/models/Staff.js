const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  staffID: { type: String, required: true },
  staffName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["Manager", "Cashier", "Delivery Staff", "Inventory Staff"], 
    required: true 
  },
  salary: { type: Number, required: true },
  contactNo: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  hireDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create unique indexes explicitly
staffSchema.index({ staffID: 1 }, { unique: true });
staffSchema.index({ email: 1 }, { unique: true });

staffSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Staff", staffSchema);
