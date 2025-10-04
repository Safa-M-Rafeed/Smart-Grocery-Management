// backend/routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Check In
router.post("/checkin/:staffId", attendanceController.checkIn);

// Check Out
router.post("/checkout/:staffId", attendanceController.checkOut);

// Get Attendance Summary
router.get("/summary/:staffId", attendanceController.getAttendanceSummary);

// Export the router
module.exports = router;
