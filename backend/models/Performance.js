const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  staffName: { type: String, required: true },
  role: { type: String, required: true },
  reviewDate: { type: String, required: true }, // yyyy-mm-dd
  kpis: [
    {
      kpiName: { type: String, required: true },
      target: { type: Number, required: true },
      achieved: { type: Number, required: true },
      remarks: { type: String },
    }
  ],
  overallRating: { type: Number, required: true, min: 0, max: 5 },
  reviewer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Performance", performanceSchema);
