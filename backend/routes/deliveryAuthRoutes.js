const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

// Delivery staff login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find staff member by email
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if staff is active
    if (!staff.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check if staff is delivery staff
    if (staff.role !== 'Delivery Staff') {
      return res.status(403).json({ error: 'Access denied. Delivery staff only.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        staffId: staff._id, 
        email: staff.email, 
        role: staff.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      staff: {
        id: staff._id,
        staffID: staff.staffID,
        staffName: staff.staffName,
        email: staff.email,
        role: staff.role,
        contactNo: staff.contactNo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current staff profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const staff = await Staff.findById(decoded.staffId).select('-password');

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update staff profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { staffName, contactNo } = req.body;

    const staff = await Staff.findByIdAndUpdate(
      decoded.staffId,
      { staffName, contactNo },
      { new: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { currentPassword, newPassword } = req.body;

    const staff = await Staff.findById(decoded.staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, staff.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await Staff.findByIdAndUpdate(decoded.staffId, { password: hashedNewPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.staffId = decoded.staffId;
    req.staffRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { router, verifyToken };



