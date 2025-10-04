const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: Date, required: true },
  checkIn: { type: String },
  checkOut: { type: String },
  workingHours: { type: Number, default: 0 }, // new, can calculate from checkIn/checkOut
  status: { type: String, enum: ["Present", "Absent", "Half-Day"], required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) }, // for daily summary
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, enum: ["Present", "Absent", "Half-Day"], default: "Present" }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
