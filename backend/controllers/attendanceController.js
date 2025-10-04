// backend/controllers/attendanceController.js
const Attendance = require("../models/Attendance");
const Staff = require("../models/Staff");
const { Parser } = require("json2csv");

// Helper: get start of today
const getStartOfDay = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Check In
exports.checkIn = async (req, res) => {
  try {
    const { staffId } = req.params;
    const today = getStartOfDay();

    let record = await Attendance.findOne({ staff: staffId, date: today });
    if (record && record.checkIn)
      return res.status(400).json({ message: "Already checked in" });

    if (!record) record = new Attendance({ staff: staffId, checkIn: new Date(), date: today });
    else record.checkIn = new Date();

    await record.save();
    res.json({ message: "Checked in successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check Out
exports.checkOut = async (req, res) => {
  try {
    const { staffId } = req.params;
    const today = getStartOfDay();

    let record = await Attendance.findOne({ staff: staffId, date: today });
    if (!record || !record.checkIn)
      return res.status(400).json({ message: "Check in first" });
    if (record.checkOut)
      return res.status(400).json({ message: "Already checked out" });

    record.checkOut = new Date();
    await record.save();
    res.json({ message: "Checked out successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get attendance summary for staff
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { staffId } = req.params;
    const today = getStartOfDay();

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const todayRecord = await Attendance.findOne({ staff: staffId, date: today });
    const weeklyRecords = await Attendance.find({ staff: staffId, date: { $gte: weekAgo } });

    let weeklyHours = 0;
    weeklyRecords.forEach(r => {
      if (r.checkIn && r.checkOut)
        weeklyHours += (r.checkOut - r.checkIn) / (1000 * 60 * 60);
    });

    res.json({
      today: todayRecord ? { checkIn: todayRecord.checkIn, checkOut: todayRecord.checkOut } : null,
      weeklyHours: weeklyHours.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export Daily Attendance
exports.exportDailyAttendance = async (req, res) => {
  try {
    const today = getStartOfDay();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const records = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate("staff", "staffName email role");

    const csvData = records.map(r => ({
      Name: r.staff.staffName,
      Email: r.staff.email,
      Role: r.staff.role,
      CheckIn: r.checkIn ? r.checkIn.toLocaleTimeString() : "--",
      CheckOut: r.checkOut ? r.checkOut.toLocaleTimeString() : "--",
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance_daily.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export daily attendance" });
  }
};

// Export Weekly Attendance
exports.exportWeeklyAttendance = async (req, res) => {
  try {
    const today = getStartOfDay();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const records = await Attendance.find({
      date: { $gte: weekAgo, $lt: today }
    }).populate("staff", "staffName email role");

    const summary = {};
    records.forEach(r => {
      const staffName = r.staff.staffName;
      const checkIn = r.checkIn ? new Date(r.checkIn) : null;
      const checkOut = r.checkOut ? new Date(r.checkOut) : null;
      const hours = checkIn && checkOut ? (checkOut - checkIn) / (1000*60*60) : 0;

      if (!summary[staffName])
        summary[staffName] = { Name: staffName, Email: r.staff.email, Role: r.staff.role, WeeklyHours: 0 };
      summary[staffName].WeeklyHours += hours;
    });

    const csvData = Object.values(summary);
    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance_weekly.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export weekly attendance" });
  }
};