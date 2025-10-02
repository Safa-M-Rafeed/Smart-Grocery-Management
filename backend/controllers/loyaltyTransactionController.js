const LoyaltyTransaction = require("../models/LoyaltyTransaction");
const Customer = require("../models/Customer");

// Create loyalty transaction when customer is created
const createLoyaltyTransaction = async (req, res) => {
  try {
    const {
      customerID,
      transactionType = "CARD_CREATED",
      pointsEarned = 0,
      pointsRedeemed = 0,
    } = req.body;

    // Generate unique transaction ID
    const transactionID = `LT${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const loyaltyTransaction = new LoyaltyTransaction({
      transactionID,
      customerID,
      orderID: null, // No order for card creation
      pointsEarned,
      pointsRedeemed,
    });

    const savedTransaction = await loyaltyTransaction.save();

    res.status(201).json({
      message: "Loyalty transaction created successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create loyalty transaction for purchase
const createPurchaseLoyaltyTransaction = async (req, res) => {
  try {
    const { customerID, orderID, totalAmount, pointsRedeemed = 0 } = req.body;

    // Calculate points earned (1 point per 100 LKR)
    const pointsEarned = Math.floor((totalAmount - pointsRedeemed) / 100);

    // Generate unique transaction ID
    const transactionID = `LT${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const loyaltyTransaction = new LoyaltyTransaction({
      transactionID,
      customerID,
      orderID,
      pointsEarned,
      pointsRedeemed,
    });

    const savedTransaction = await loyaltyTransaction.save();

    // Update customer loyalty points
    const customer = await Customer.findById(customerID);
    if (customer) {
      customer.loyaltyPoints =
        customer.loyaltyPoints + pointsEarned - pointsRedeemed;
      customer.loyaltyPoints = Math.max(0, customer.loyaltyPoints); // Ensure non-negative
      await customer.save();
    }

    res.status(201).json({
      message: "Purchase loyalty transaction created successfully",
      transaction: savedTransaction,
      newLoyaltyPoints: customer.loyaltyPoints,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get loyalty transactions by customer
const getLoyaltyTransactionsByCustomer = async (req, res) => {
  try {
    const { customerID } = req.params;

    const transactions = await LoyaltyTransaction.find({ customerID })
      .populate("customerID", "customerName email phone")
      .populate("orderID", "orderNumber totalAmount")
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all loyalty transactions
const getAllLoyaltyTransactions = async (req, res) => {
  try {
    const transactions = await LoyaltyTransaction.find()
      .populate("customerID", "customerName email phone")
      .populate("orderID", "orderNumber totalAmount")
      .sort({ date: -1 })
      .limit(100);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get loyalty transaction by ID
const getLoyaltyTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await LoyaltyTransaction.findById(transactionId)
      .populate("customerID", "customerName email phone loyaltyPoints")
      .populate("orderID", "orderNumber totalAmount");

    if (!transaction) {
      return res.status(404).json({ message: "Loyalty transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createLoyaltyTransaction,
  createPurchaseLoyaltyTransaction,
  getLoyaltyTransactionsByCustomer,
  getAllLoyaltyTransactions,
  getLoyaltyTransactionById,
};
