// backend/controllers/staffController.js
const Staff = require("../models/Staff");
const jwt = require("jsonwebtoken");

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

// Role permissions map
const rolePermissions = {
  Admin: ["createStaff", "editStaff", "deleteStaff", "toggleStatus"],
  Cashier: ["viewSales", "processPayments"],
  "Inventory Clerk": ["viewInventory", "updateStock"],
  "Loan Officer": ["viewLoans", "approveLoans"],
  "Delivery Person": ["viewDelivery", "updateDeliveryStatus"],
};

// CREATE STAFF
exports.createStaff = async (req, res) => {
  try {
    const { staffName, email, role, salary, contactNo, address, password } = req.body;
    if (!staffName || !email || !role || !password || !contactNo)
      return res.status(400).json({ message: "Please fill all required fields" });

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) return res.status(400).json({ message: "Staff with this email already exists" });

    const staff = new Staff({
      staffName,
      name: staffName,
      staffID: `S-${Math.floor(1000 + Math.random() * 9000)}`,
      email,
      role,
      permissions: rolePermissions[role] || [],
      salary: salary || 0,
      contactNo,
      address: address || "",
      password, // plaintext for now (you asked to leave hashing aside)
      status: "Active"
    });

    await staff.save();
    const staffSafe = staff.toObject();
    delete staffSafe.password;

    res.status(201).json({ message: "✅ Staff created successfully", staff: staffSafe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL STAFF
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(staffList);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE STAFF
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ...updateData } = req.body;

    if (role) updateData.permissions = rolePermissions[role] || [];

    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });

    res.status(200).json({ message: "✅ Staff updated successfully", updatedStaff });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE STATUS
exports.toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.status = staff.status === "Active" ? "Inactive" : "Active";
    await staff.save();

    const staffSafe = staff.toObject();
    delete staffSafe.password;
    res.status(200).json({ message: `✅ Staff status changed to ${staff.status}`, staff: staffSafe });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE (optional)
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Staff.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json({ message: "Staff removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// STAFF LOGIN
exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    if (staff.password !== password) return res.status(401).json({ message: "Invalid password" });
    if (staff.status !== "Active") return res.status(403).json({ message: "Staff is inactive" });

    const token = jwt.sign({ id: staff._id, role: staff.role, name: staff.staffName }, JWT_SECRET, { expiresIn: "8h" });

    res.status(200).json({ token, role: staff.role, staffName: staff.staffName });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
