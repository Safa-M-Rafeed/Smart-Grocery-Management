// backend/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");

// Staff can check in/out for themselves (verifyToken) or admin can do it
router.post("/checkin/:staffId", verifyToken, attendanceController.checkIn);
router.post("/checkout/:staffId", verifyToken, attendanceController.checkOut);

// Get attendance summary for one staff (self or admin)
router.get("/summary/:staffId", verifyToken, attendanceController.getAttendanceSummary);

// Admin-only exports
router.get("/export/daily", verifyAdmin, attendanceController.exportDailyAttendance);
router.get("/export/weekly", verifyAdmin, attendanceController.exportWeeklyAttendance);

// Optional: get all attendance (admin)
router.get("/", verifyAdmin, attendanceController.getAllAttendance);

module.exports = router;
