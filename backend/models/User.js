const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
  },
  passwordHash: {
    type: String,
    required: true, // Store the hashed password
  },
  role: {
    type: String,
    enum: ['ADMIN', 'CASHIER', 'INVENTORY_CLERK', 'DELIVERY_STAFF', 'LOAN_OFFICER'],
    default: 'CASHIER', // Default role for users
  },
  active: {
    type: Boolean,
    default: true, // By default, users are active
  },
}, { timestamps: true });

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
