const express = require("express");
const router = express.Router();
const {
  createPerformance,
  getAllPerformance,
  getStaffPerformance,
  updatePerformance,
  deletePerformance,
} = require("../controllers/performanceController");
const { verifyAdmin, verifyToken } = require("../middlewares/auth");

// Admin-only routes
router.post("/", verifyAdmin, createPerformance);
router.put("/:id", verifyAdmin, updatePerformance);
router.delete("/:id", verifyAdmin, deletePerformance);

// Public / logged-in routes
router.get("/all", verifyToken, getAllPerformance);
router.get("/staff/:staffId", verifyToken, getStaffPerformance);

module.exports = router;
