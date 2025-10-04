// backend/models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
<<<<<<< Updated upstream
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: Date, required: true },
  checkIn: { type: String },
  checkOut: { type: String },
  status: { type: String, enum: ["Present", "Absent", "Half-Day"], required: true }
});
=======
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  date: { type: Date, default: () => new Date().setHours(0,0,0,0) }, // for daily summary
}, { timestamps: true });
>>>>>>> Stashed changes

module.exports = mongoose.model("Attendance", attendanceSchema);
