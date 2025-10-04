// backend/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth");
const attendanceController = require("../controllers/attendanceController");

// Staff can check in/out for themselves
router.post("/checkin/:staffId", verifyToken, attendanceController.checkIn);
router.post("/checkout/:staffId", verifyToken, attendanceController.checkOut);
router.get("/summary/:staffId", verifyToken, attendanceController.getAttendanceSummary);

// Admin-only exports
router.get("/export/daily", verifyAdmin, attendanceController.exportDailyAttendance);
router.get("/export/weekly", verifyAdmin, attendanceController.exportWeeklyAttendance);

module.exports = router;
