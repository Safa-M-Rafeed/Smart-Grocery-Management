// backend/models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) }, // UTC midnight of day
  checkIn: { type: Date },
  checkOut: { type: Date },
  workingHours: { type: Number, default: 0 }, // hours float
  status: { type: String, enum: ["Present", "Absent", "Half-Day"], default: "Present" }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
