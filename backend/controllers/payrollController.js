const Attendance = require("../models/Attendance");
const Staff = require("../models/Staff");

// Role-based hourly rates
const HOURLY_RATES = {
  Admin: 700,
  Delivery: 450,
  Other: 400,
};

// Helper to get rate
const getHourlyRate = (role) => {
  if (role === "Admin") return HOURLY_RATES.Admin;
  if (role.toLowerCase().includes("delivery")) return HOURLY_RATES.Delivery;
  return HOURLY_RATES.Other;
};

// Generate payroll for a given month & staff
exports.generatePayroll = async (req, res) => {
  try {
    const { staffId, month, year } = req.query;

    // Build filter
    let filter = {};
    if (staffId) filter.staffId = staffId;
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: startDate.toISOString().split("T")[0], $lte: endDate.toISOString().split("T")[0] };
    }

    const attendanceData = await Attendance.find(filter).populate("staffId");

    // Aggregate payroll per staff
    const payrollMap = {};

    attendanceData.forEach((att) => {
      const staffKey = att.staffId._id;
      if (!payrollMap[staffKey]) {
        payrollMap[staffKey] = {
          staffName: att.staffName,
          role: att.role,
          hoursWorked: 0,
          rate: getHourlyRate(att.role),
          allowances: 0,
          deductions: 0,
        };
      }
      payrollMap[staffKey].hoursWorked += att.hoursWorked;
    });

    // Calculate net pay
    const payroll = Object.values(payrollMap).map((p) => ({
      ...p,
      netPay: p.hoursWorked * p.rate + p.allowances - p.deductions,
    }));

    res.json(payroll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate payroll" });
  }
};
