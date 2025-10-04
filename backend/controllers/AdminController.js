// backend/controllers/AdminController.js
const Admin = require("../models/Admin"); // create Admin schema if not exists
const bcrypt = require("bcryptjs");

exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id; // from auth middleware
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email, contactNo, password } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.contactNo = contactNo || admin.contactNo;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    const { password: _, ...adminData } = admin._doc;
    res.json(adminData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
