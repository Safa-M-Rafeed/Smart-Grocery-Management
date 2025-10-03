const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Use environment variable for security in production
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

/**
 * Register Staff (Admin only)
 */
exports.createStaff = async (req, res) => {
  try {
    const { staffName, email, role, salary, contactNo, address, password } = req.body;

    if (!staffName || !email || !role || !password || !contactNo) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new Staff({
      staffName,
      name: staffName, // display name same as staffName
      staffID: `S-${Math.floor(1000 + Math.random() * 9000)}`, // auto-generate unique ID
      email,
      role,
      salary: salary || 0,
      contactNo,
      address: address || "",
      password: hashedPassword,
      status: "Active"
    });

    await staff.save();
    res.status(201).json({ message: "✅ Staff created successfully", staff });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Staff Login
 */
exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign(
      { id: staff._id, role: staff.role, name: staff.staffName },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ token, role: staff.role, staffName: staff.staffName });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all staff (Admin only)
 */
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.status(200).json(staffList);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update staff info (Admin only)
 */
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password is provided, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "✅ Staff updated successfully", updatedStaff });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Activate/Deactivate staff (Admin only)
 */
exports.toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.status = staff.status === "Active" ? "Inactive" : "Active";
    await staff.save();

    res.status(200).json({ message: `✅ Staff status changed to ${staff.status}`, staff });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
