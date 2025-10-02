const express = require("express");
const router = express.Router();
const {
  createLoyaltyTransaction,
  createPurchaseLoyaltyTransaction,
  getLoyaltyTransactionsByCustomer,
  getAllLoyaltyTransactions,
  getLoyaltyTransactionById
} = require('../controllers/loyaltyTransactionController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Create loyalty transaction (for card creation)
router.post("/", requireAuth(['ADMIN', 'CASHIER']), createLoyaltyTransaction);

// Create purchase loyalty transaction
router.post("/purchase", requireAuth(['ADMIN', 'CASHIER']), createPurchaseLoyaltyTransaction);

// Get all loyalty transactions (Admin only)
router.get("/", requireAuth(['ADMIN']), getAllLoyaltyTransactions);

// Get loyalty transactions by customer
router.get("/customer/:customerID", requireAuth(['ADMIN', 'CASHIER']), getLoyaltyTransactionsByCustomer);

// Get single loyalty transaction by ID
router.get("/:transactionId", requireAuth(['ADMIN', 'CASHIER']), getLoyaltyTransactionById);

module.exports = router;
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
