const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// Customer registration
router.post('/register', async (req, res) => {
  try {
    const { customerName, email, password, phone } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const customer = new Customer({
      customerName,
      email,
      password: hashedPassword,
      phone,
      loyaltyPoints: 0
    });

    await customer.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        customerId: customer._id, 
        email: customer.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        customerName: customer.customerName,
        email: customer.email,
        phone: customer.phone,
        loyaltyPoints: customer.loyaltyPoints
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        customerId: customer._id, 
        email: customer.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      customer: {
        id: customer._id,
        customerName: customer.customerName,
        email: customer.email,
        phone: customer.phone,
        loyaltyPoints: customer.loyaltyPoints
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current customer profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const customer = await Customer.findById(decoded.customerId).select('-password');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update customer profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { customerName, phone } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      decoded.customerId,
      { customerName, phone },
      { new: true }
    ).select('-password');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



