// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Routes – import BEFORE using them
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staffRoutes');
const staffDashboardRoutes = require('./routes/staffDashboard'); // optional
const attendanceRoutes = require('./routes/attendanceRoutes');

// Use routes
app.use('/api/auth', authRoutes); // Login/Register
app.use('/api/staff-dashboard', staffDashboardRoutes); // Admin-only dashboard (if used)
app.use('/api/staffs', staffRoutes); // Staff CRUD (plural)
app.use('/api/staff', staffRoutes);  // also expose singular to avoid front-end mismatch
app.use('/api/attendance', attendanceRoutes); // Attendance routes


// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // mongoose options (not strictly necessary for modern drivers but harmless)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
