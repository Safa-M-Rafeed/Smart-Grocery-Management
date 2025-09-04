const mongoose = require("mongoose");

const orderLoanSchema = new mongoose.Schema({
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  loanID: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true }
});

module.exports = mongoose.model("OrderLoan", orderLoanSchema);
