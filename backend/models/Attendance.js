const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  staffName: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: String, required: true }, // yyyy-mm-dd
  checkIn: { type: String, default: null }, // timestamp string
  checkOut: { type: String, default: null }, // timestamp string
  hoursWorked: { type: Number, default: 0 }, // calculated after check-out
});

module.exports = mongoose.model("Attendance", attendanceSchema);
