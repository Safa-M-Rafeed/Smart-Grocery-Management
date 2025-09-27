const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: Date, required: true },
  checkIn: { type: String },
  checkOut: { type: String },
  workingHours: { type: Number, default: 0 }, // new, can calculate from checkIn/checkOut
  status: { type: String, enum: ["Present", "Absent", "Half-Day"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
