const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    // Create collection if it doesn't exist
    const collections = await mongoose.connection.db.listCollections({ name: 'products' }).toArray();
    if (collections.length === 0) {
      await mongoose.connection.db.createCollection('products');
      console.log('Collection "products" created');
    } else {
      console.log('Collection "products" already exists');
    }
    process.exit(0); // Exit after creation
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();