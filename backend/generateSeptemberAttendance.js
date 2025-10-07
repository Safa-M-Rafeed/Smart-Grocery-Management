// scripts/generateSeptemberAttendance.js
const mongoose = require("mongoose");
const Attendance = require("../backend/models/Attendance"); // adjust path
const Staff = require("../backend/models/Staff");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function generateSeptemberAttendance() {
  try {
    const staffList = await Staff.find(); // all staff
    if (!staffList.length) {
      console.log("No staff found. Add staff first!");
      return;
    }

    const startDate = new Date("2025-09-01");
    const endDate = new Date("2025-09-30");

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];

      for (const staff of staffList) {
        // Randomize hoursWorked for variety
        const hoursWorked = Math.random() < 0.1 ? 0 : 4 + Math.random() * 4; // 0, 4-8 hours
        const checkIn = hoursWorked ? new Date(d.setHours(9, 0, 0)) : null;
        const checkOut = hoursWorked ? new Date(d.setHours(9 + Math.floor(hoursWorked), 0, 0)) : null;

        const attendance = new Attendance({
          staffId: staff._id,
          staffName: staff.staffName,
          role: staff.role,
          date: dateStr,
          checkIn: checkIn ? checkIn.toISOString() : null,
          checkOut: checkOut ? checkOut.toISOString() : null,
          hoursWorked: Math.round(hoursWorked * 100) / 100,
        });

        await attendance.save();
      }
    }

    console.log("✅ Attendance for September generated!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

generateSeptemberAttendance();
