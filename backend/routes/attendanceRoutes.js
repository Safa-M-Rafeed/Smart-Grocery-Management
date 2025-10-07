const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Staff = require("../models/Staff");
const { verifyAdmin } = require("../middlewares/auth");

// --- GET today's attendance for all staff ---
router.get("/all", verifyAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const staffList = await Staff.find();
    const attendanceRecords = await Attendance.find({ date: today });

    const allRecords = staffList.map((staff) => {
      const existing = attendanceRecords.find(
        (att) => att.staffId.toString() === staff._id.toString()
      );
      return existing || {
        _id: staff._id,
        staffId: staff._id,
        staffName: staff.staffName,
        role: staff.role,
        date: today,
        checkIn: null,
        checkOut: null,
        hoursWorked: 0,
        status: null, // can be 'sick' or other manual status
      };
    });

    res.status(200).json(allRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

// --- PATCH check-in/check-out or manual times ---
router.patch("/:staffId", verifyAdmin, async (req, res) => {
  try {
    const { staffId } = req.params;
    const { type, checkIn, checkOut } = req.body; // type = "checkIn" / "checkOut", OR manual checkIn/checkOut
    const today = new Date().toISOString().split("T")[0];

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    let record = await Attendance.findOne({ staffId, date: today });
    if (!record) {
      record = new Attendance({
        staffId,
        staffName: staff.staffName,
        role: staff.role,
        date: today,
      });
    }

    // Manual times from input fields
    if (checkIn) record.checkIn = new Date(`${today}T${checkIn}:00`);
    if (checkOut) record.checkOut = new Date(`${today}T${checkOut}:00`);

    // Regular check-in/check-out buttons
    const currentTime = new Date().toISOString();
    if (type === "checkIn") record.checkIn = currentTime;
    if (type === "checkOut") record.checkOut = currentTime;

    // Calculate hours worked
    if (record.checkIn && record.checkOut) {
      const hoursWorked = (new Date(record.checkOut) - new Date(record.checkIn)) / 3600000;
      record.hoursWorked = parseFloat(hoursWorked.toFixed(2));
    }

    await record.save();
    res.status(200).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update/add attendance" });
  }
});

// --- GET full attendance history for a staff ---
router.get("/staff/:staffId", verifyAdmin, async (req, res) => {
  try {
    const { staffId } = req.params;
    const records = await Attendance.find({ staffId }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch attendance history" });
  }
});

module.exports = router;
