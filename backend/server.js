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

app.use('/api/auth', authRoutes); // Login/Register
app.use('/api/staff-dashboard', staffDashboardRoutes); // Admin-only
app.use("/api/staffs", staffRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
