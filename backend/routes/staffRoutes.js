const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { verifyAdmin } = require("../middlewares/auth");

// Admin-only CRUD routes
router.post("/", verifyAdmin, staffController.createStaff);
router.get("/", verifyAdmin, staffController.getAllStaff);
router.put("/:id", verifyAdmin, staffController.updateStaff);
router.patch("/:id/status", verifyAdmin, staffController.toggleStaffStatus);

module.exports = router;
// backend/routes/staffRoutes.js