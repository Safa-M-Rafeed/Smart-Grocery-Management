const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  staffName: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // new
  role: { type: String, required: true },
  salary: { type: Number, required: true, min: 0 },
  contactNo: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);  // simple 10-digit validation
      },
      message: props => `${props.value} is not a valid contact number!`
    }
  },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }, // new
  address: { type: String } // optional
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
