const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  loanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  repaymentSchedule: { type: String, required: true },
  loanStatus: { type: String, enum: ["Active", "Closed", "Default"], default: "Active" },
  defaultStatus: { type: Boolean, default: false }
});

module.exports = mongoose.model("Loan", loanSchema);
