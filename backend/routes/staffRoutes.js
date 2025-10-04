const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { getStaffProfile, updateStaffProfile } = require("../controllers/staffProfileController");
const { verifyAdmin, verifyToken } = require("../middlewares/auth");

// Staff CRUD routes (Admin only)
router.post("/", verifyAdmin, staffController.createStaff);
router.get("/all", verifyAdmin, staffController.getAllStaff); // Changed to /all to avoid conflict
router.put("/:id", verifyAdmin, staffController.updateStaff);
router.patch("/:id/status", verifyAdmin, staffController.toggleStaffStatus);
router.delete("/:id", verifyAdmin, staffController.deleteStaff);

// Logged-in staff profile routes (any logged-in staff)
router.get("/profile", verifyToken, getStaffProfile);   // GET /api/staff/profile
router.put("/profile", verifyToken, updateStaffProfile); // PUT /api/staff/profile

module.exports = router;
