const express = require("express");
const router = express.Router();
const controller = require("../controllers/workScheduleController");

// Create a new work shift
router.post("/", controller.createShift);

// Get all work shifts
router.get("/", controller.getShifts);

// Assign a shift to a staff member
router.post("/assign", controller.assignShift);

// Get schedules for a specific staff member
router.get("/staff/:staffId", controller.getSchedulesByStaff);

module.exports = router;
