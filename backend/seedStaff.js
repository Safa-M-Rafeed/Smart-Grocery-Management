// backend/seedStaff.js
require('dotenv').config(); // load env variables
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Staff = require('./models/Staff');

// Staff data to seed
const staffData = [
  {
    staffName: "Safa M Rafeed",
    email: "safa@smartgrocery.com",
    password: "admin123",
    role: "Admin",
    salary: 0,
    contactNo: "0771000000",
    status: "Active",
    address: "Head Office"
  },
  {
    staffName: "Ishani",
    email: "ishani@smartgrocery.com",
    password: "cashier123",
    role: "Cashier",
    salary: 35000,
    contactNo: "0772000000",
    status: "Active",
    address: "Branch 1"
  },
  {
    staffName: "Sithuli",
    email: "sithu@smartgrocery.com",
    password: "inventory123",
    role: "Inventory Staff",
    salary: 32000,
    contactNo: "0773000000",
    status: "Active",
    address: "Inventory Department"
  },
  {
    staffName: "Buddhi",
    email: "buddhi@smartgrocery.com",
    password: "loan123",
    role: "Loan Officer",
    salary: 36000,
    contactNo: "0774000000",
    status: "Active",
    address: "Loan Department"
  },
  {
    staffName: "Amish",
    email: "amish@smartgrocery.com",
    password: "delivery123",
    role: "Delivery Staff",
    salary: 30000,
    contactNo: "0775000000",
    status: "Active",
    address: "Delivery Department"
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

(async () => {
  try {
    // Clear existing staff
    await Staff.deleteMany({});
    console.log("🗑 Cleared existing staff data");

    for (let s of staffData) {
      // Hash password
      const hashedPassword = await bcrypt.hash(s.password, 10);

      // Create staff with required fields
      await Staff.create({
        staffID: `S-${Math.floor(1000 + Math.random() * 9000)}`, // ensure unique ID
        name: s.staffName,  // required field for display
        staffName: s.staffName,
        email: s.email,
        password: hashedPassword,
        role: s.role,
        salary: s.salary,
        contactNo: s.contactNo,
        status: s.status,
        address: s.address
      });

      console.log(`✅ ${s.staffName} added`);
    }

    console.log("🎯 All staff seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding staff:", err);
    process.exit(1);
  }
})();
