const mongoose = require("mongoose");

const performanceReviewSchema = new mongoose.Schema({
  staffID: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5, required: true },
  remarks: { type: String }
});

module.exports = mongoose.model("PerformanceReview", performanceReviewSchema);
