// backend/routes/staffDashboard.js
const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middlewares/auth");
const Staff = require("../models/Staff");

// All routes here require Admin
router.use(verifyAdmin);

// GET all staff (Admin only)
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add more staff-related routes here (create, update, delete)

module.exports = router;
