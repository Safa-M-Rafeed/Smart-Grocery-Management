// models/WorkSchedule.js
const mongoose = require("mongoose");

const WorkScheduleSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("WorkSchedule", WorkScheduleSchema);
