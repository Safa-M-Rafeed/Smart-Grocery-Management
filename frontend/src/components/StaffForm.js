import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffForm = ({ refresh, editStaff, setEditStaff }) => {
  const [form, setForm] = useState({
    staffName: "", email: "", role: "", salary: "", contactNo: "", address: "", password: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editStaff) setForm({ ...editStaff, password: "" });
  }, [editStaff]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editStaff) {
        await axios.put(`/api/staff/${editStaff._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("/api/staff", form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ staffName: "", email: "", role: "", salary: "", contactNo: "", address: "", password: "" });
      setEditStaff(null);
      refresh();
    } catch (err) { console.error(err); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="staffName" placeholder="Full Name" value={form.staffName} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
      <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
      <input name="contactNo" placeholder="Contact No" value={form.contactNo} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <input name="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <button type="submit">{editStaff ? "Update Staff" : "Add Staff"}</button>
      {editStaff && <button onClick={() => setEditStaff(null)}>Cancel</button>}
    </form>
  );
};

export default StaffForm;
