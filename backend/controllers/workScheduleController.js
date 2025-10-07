//backend/controllers/workScheduleController.js

const Shift = require("../models/Shift");
const WorkSchedule = require("../models/WorkSchedule");

// Create a new shift
exports.createShift = async (req, res) => {
  try {
    const { shiftName, startTime, endTime } = req.body;
    const shift = new Shift({ shiftName, startTime, endTime });
    await shift.save();
    res.status(201).json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all shifts
exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign a shift to a staff member
exports.assignShift = async (req, res) => {
  try {
    const { staffId, shiftId, date } = req.body;
    const schedule = new WorkSchedule({ staffId, shiftId, date });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get schedules per staff member
exports.getSchedulesByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const schedules = await WorkSchedule.find({ staffId })
      .populate("shiftId")
      .sort({ date: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
