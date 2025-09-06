const express = require("express");
const router = express.Router();
const LoyaltyTransaction = require("../models/LoyaltyTransaction");

// Create a new loyalty transaction
router.post("/", async (req, res) => {
  try {
    const newTransaction = new LoyaltyTransaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all loyalty transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await LoyaltyTransaction.find()
      .populate("customerID", "name email")
      .populate("orderID", "orderNumber totalAmount");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single loyalty transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await LoyaltyTransaction.findById(req.params.id)
      .populate("customerID", "name email")
      .populate("orderID", "orderNumber totalAmount");

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update loyalty transaction
router.put("/:id", async (req, res) => {
  try {
    const updatedTransaction = await LoyaltyTransaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete loyalty transaction
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await LoyaltyTransaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
