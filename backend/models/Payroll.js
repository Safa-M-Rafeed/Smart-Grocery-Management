const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  month: { type: String, required: true },
  salary: { type: Number, required: true },
  allowance: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true }, // can calculate automatically
  status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  generatedDate: { type: Date, default: Date.now } // new
}, { timestamps: true });

module.exports = mongoose.model("Payroll", payrollSchema);
