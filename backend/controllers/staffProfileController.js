// backend/controllers/staffProfileController.js
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

// GET logged-in staff profile
exports.getStaffProfile = async (req, res) => {
  try {
    const staffId = req.user.id;
    const staff = await Staff.findById(staffId).select("-password");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE logged-in staff profile
exports.updateStaffProfile = async (req, res) => {
  try {
    const staffId = req.user.id;
    const { name, contactNo, address, password } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.name = name || staff.name;
    staff.contactNo = contactNo || staff.contactNo;
    staff.address = address || staff.address;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(password, salt);
    }

    await staff.save();

    const { password: _, ...staffData } = staff._doc;
    res.json(staffData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
