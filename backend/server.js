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

    // Clean up problematic indexes
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();

      // Check if orders collection exists
      const ordersCollection = collections.find(col => col.name === 'orders');
      if (ordersCollection) {
        try {
          // Try to drop the problematic orderID index if it exists
          await db.collection('orders').dropIndex('orderID_1');
          console.log('Dropped problematic orderID_1 index');
        } catch (indexError) {
          // Index might not exist, which is fine
          console.log('orderID_1 index not found or already dropped');
        }
      }
    } catch (cleanupError) {
      console.log('Index cleanup completed');
    }

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// Staff route
const staffRoutes = require('./routes/staff');
app.use('/api/staff', staffRoutes);

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Product routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Customer routes
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

// Loyalty routes
const loyaltyRoutes = require('./routes/LoyaltyRoute');
app.use('/api/loyalty', loyaltyRoutes);

// Order routes
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Order Item routes
const orderItemRoutes = require('./routes/OrderItemRoutes');
app.use('/api/order-items', orderItemRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});