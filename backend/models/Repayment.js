const mongoose = require("mongoose");

const repaymentSchema = new mongoose.Schema({
  loanID: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
  date: { type: Date, default: Date.now },
  amountPaid: { type: Number, required: true },
  status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" }
});

module.exports = mongoose.model("Repayment", repaymentSchema);
