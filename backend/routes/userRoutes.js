/*
//userRoutes.js
const router = require('express').Router();
const User = require('../models/User');
const { requireAuth } = require('../middlewares/authMiddleware');

// @desc Get all users (Admin only)
router.get('/', requireAuth(['ADMIN']), async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash'); // hide password
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// @desc Get one user (Admin or self)
router.get('/:id', requireAuth(['ADMIN', 'CASHIER', 'INVENTORY_CLERK', 'DELIVERY_STAFF', 'LOAN_OFFICER']), async (req, res, next) => {
  try {
    // only admin can see anyone, others only themselves
    if (req.user.role !== 'ADMIN' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// @desc Deactivate a user (Admin only)
router.patch('/:id/deactivate', requireAuth(['ADMIN']), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
*/