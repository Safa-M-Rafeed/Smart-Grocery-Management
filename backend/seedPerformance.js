require('dotenv').config();
const mongoose = require('mongoose');
const Performance = require('./models/Performance');
const Staff = require('./models/Staff');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

(async () => {
  try {
    // Fetch all existing staff
    const staffs = await Staff.find({});
    if (!staffs.length) {
      console.log("❌ No staff found. Please seed staff first.");
      process.exit(1);
    }

    // Example performance data template
    const performanceData = staffs.map((staff) => ({
      staffId: staff._id,
      staffName: staff.name || staff.staffName,
      role: staff.role,
      reviewDate: new Date().toISOString().split("T")[0], // today yyyy-mm-dd
      kpis: [
        { kpiName: "Efficiency", target: 100, achieved: Math.floor(Math.random() * 100), remarks: "Good" },
        { kpiName: "Attendance", target: 100, achieved: Math.floor(Math.random() * 100), remarks: "Satisfactory" },
        { kpiName: "Customer Service", target: 100, achieved: Math.floor(Math.random() * 100), remarks: "Excellent" },
      ],
      overallRating: parseFloat((Math.random() * 5).toFixed(2)), // 0-5
      reviewer: "HR Manager"
    }));

    // Clear existing performance records (optional)
    // await Performance.deleteMany({});
    // console.log("🗑 Cleared existing performance data");

    for (let p of performanceData) {
      await Performance.create(p);
      console.log(`✅ Performance record added for ${p.staffName}`);
    }

    console.log("🎯 All performance records seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding performance records:", err);
    process.exit(1);
  }
})();
