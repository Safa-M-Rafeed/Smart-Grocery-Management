const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');

// Auto check-in all staff
exports.autoCheckInAllStaff = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const allStaff = await Staff.find();
    const results = [];

    for (const staff of allStaff) {
      const existing = await Attendance.findOne({ staffId: staff._id, date: today });
      if (existing) {
        results.push({ staffId: staff._id, status: "Already checked in" });
        continue;
      }

      const checkInTime = new Date(today);
      checkInTime.setHours(8,30,0,0); // Default 8:30 AM

      const attendance = new Attendance({
        staffId: staff._id,
        checkIn: checkInTime,
        date: today
      });

      await attendance.save();
      results.push({ staffId: staff._id, status: "Checked in" });
    }

    res.status(200).json({ message: "Auto check-in complete", results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get daily attendance summary
exports.getAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const records = await Attendance.find({ date: today }).populate('staffId', 'staffName role');
    res.status(200).json(records);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

// Manual check-in/check-out for a staff
exports.manualCheck = async (req,res) => {
  try {
    const { staffId, type } = req.body;
    const today = new Date();
    today.setHours(0,0,0,0);

    let record = await Attendance.findOne({ staffId, date: today });
    if(!record) {
      if(type === "checkIn") {
        record = new Attendance({ staffId, checkIn: new Date(), date: today });
        await record.save();
        return res.status(200).json({ message: "Checked in" });
      }
      return res.status(400).json({ message: "Cannot check-out without check-in" });
    } else {
      if(type === "checkOut") {
        record.checkOut = new Date();
        await record.save();
        return res.status(200).json({ message: "Checked out" });
      } else {
        return res.status(400).json({ message: "Already checked in" });
      }
    }
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
