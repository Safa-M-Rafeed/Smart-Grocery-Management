const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/auth");
const staffRoutes = require("./routes/staffRoutes");
const staffDashboardRoutes = require("./routes/staffDashboard"); 
const attendanceRoutes = require("./routes/attendanceRoutes");
const workScheduleRoutes = require("./routes/workScheduleRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/staff-dashboard", staffDashboardRoutes);
app.use("/api/staffs", staffRoutes); // fetch all staff
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/work-schedules", workScheduleRoutes); // ✅ matches frontend
app.use("/api/payroll", payrollRoutes);
app.use("/api/performance", performanceRoutes);


// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
