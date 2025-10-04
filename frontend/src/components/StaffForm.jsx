// frontend/src/components/StaffForm.jsx
import React, { useState, useEffect } from "react";
import { createStaff, updateStaff } from "../services/api";

const StaffForm = ({ staff, onClose }) => {
  const [formData, setFormData] = useState({
    staffName: "",
    email: "",
    role: "Cashier",
    salary: 0,
    contactNo: "",
    address: "",
    password: ""
  });

  useEffect(() => {
    if (staff) setFormData({ ...staff, password: "" });
  }, [staff]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (staff) await updateStaff(staff._id, formData);
      else await createStaff(formData);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h3 className="text-lg font-bold mb-4">{staff ? "Edit Staff" : "Add Staff"}</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="staffName" placeholder="Full Name" value={formData.staffName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Cashier">Cashier</option>
          <option value="Inventory">Inventory</option>
          <option value="Delivery">Delivery</option>
          <option value="LoanOfficer">Loan Officer</option>
          <option value="System">System</option>
        </select>
        <input name="salary" type="number" placeholder="Salary" value={formData.salary} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="contactNo" placeholder="Contact No" value={formData.contactNo} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        {!staff && <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />}
        <button type="submit" className="w-full bg-[#537D5D] text-white py-2 rounded hover:bg-[#73946B]">{staff ? "Update" : "Create"}</button>
        <button type="button" onClick={onClose} className="w-full bg-[#D2D0A0] text-[#537D5D] py-2 rounded hover:bg-[#9EBC8A] mt-2">Cancel</button>
      </form>
    </div>
  );
};

export default StaffForm;
