const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

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

// Routes
const staffRoutes = require('./routes/staff');
const deliveryRoutes = require('./routes/deliveryRoutes');
const { router: deliveryAuthRoutes } = require('./routes/deliveryAuthRoutes');
const customerAuthRoutes = require('./routes/customerAuthRoutes');
const customerRoutes = require('./routes/customerRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/staff', staffRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/delivery-auth', deliveryAuthRoutes);
app.use('/api/customer-auth', customerAuthRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/reports', reportRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
