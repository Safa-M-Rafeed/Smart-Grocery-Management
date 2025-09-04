const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  staffName: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  contactNo: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
