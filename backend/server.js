// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const staffDashboardRoutes = require('./routes/staffDashboard');
const staffRoutes = require("./routes/staffRoutes");

// Use routes
app.use('/api/auth', authRoutes); // Login/Register
app.use('/api/staff-dashboard', staffDashboardRoutes); // Admin-only
app.use("/api/staffs", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
>>>>>>> Stashed changes

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// Staff route
const staffRoutes = require('./routes/staff');
app.use('/api/staff', staffRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});