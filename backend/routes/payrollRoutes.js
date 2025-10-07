const express = require("express");
const router = express.Router();
const { generatePayroll } = require("../controllers/payrollController");
const { verifyAdmin } = require("../middlewares/auth");

// GET /api/payroll?staffId=&month=&year=
router.get("/", verifyAdmin, generatePayroll);

module.exports = router;
