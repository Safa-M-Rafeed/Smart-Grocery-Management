// backend/models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  staffName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // Admin, Cashier, etc.
  salary: { type: Number, required: true, min: 0, default: 0 },
  permissions: [{ type: String }],
  contactNo: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid contact number!`,
    },
  },
  address: { type: String },
  profileImage: { type: String }, // optional for profile pics
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
