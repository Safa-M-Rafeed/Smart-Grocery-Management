const User = require("../models/User");
const jwt = require("jsonwebtoken");

// @desc    Register a new customer
// @route   POST /api/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, contactNo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new customer (role automatically "customer")
    const user = await User.create({ name, email, password, contactNo });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
