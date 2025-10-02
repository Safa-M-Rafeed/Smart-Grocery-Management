const mongoose = require("mongoose");

const loyaltyTransactionSchema = new mongoose.Schema({
  transactionID: { type: String, required: true, unique: true },
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false }, // Make optional
  pointsEarned: { type: Number, default: 0 },
  pointsRedeemed: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoyaltyTransaction", loyaltyTransactionSchema);
