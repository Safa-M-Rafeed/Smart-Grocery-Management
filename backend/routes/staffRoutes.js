const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { verifyAdmin } = require("../middleware/auth"); // Admin middleware

// ------------------------
// Public route for staff login
// ------------------------
router.post("/login", staffController.loginStaff);

// ------------------------
// Admin-only routes
// ------------------------

// Create new staff (Admin only)
router.post("/", verifyAdmin, staffController.createStaff);

// Get all staff (Admin only)
router.get("/", verifyAdmin, staffController.getAllStaff);

// Update staff info (Admin only)
router.put("/:id", verifyAdmin, staffController.updateStaff);

// Deactivate/Activate staff (Admin only)
router.patch("/:id/status", verifyAdmin, staffController.toggleStaffStatus);

module.exports = router;
