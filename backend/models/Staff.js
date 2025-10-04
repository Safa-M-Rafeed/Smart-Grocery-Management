const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffID: { type: String, required: true, unique: true }, // unique staff ID
  name: { type: String, required: true },                 // display name
  staffName: { type: String, required: true },            // actual full name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // e.g., Admin, Cashier, etc.
  salary: { type: Number, required: true, min: 0 },
  permissions: [{ type: String }], 
  contactNo: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) { return /^\d{10}$/.test(v); },
      message: props => `${props.value} is not a valid contact number!`
    }
  },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
