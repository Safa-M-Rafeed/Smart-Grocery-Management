import React, { useState } from 'react';

const StaffForm = () => {
  const [form, setForm] = useState({
    staffName: '',
    email: '',
    role: '',
    salary: '',
    contactNo: '',
    status: 'Active',
    address: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert('Staff details saved!');
        setForm({
          staffName: '',
          email: '',
          role: '',
          salary: '',
          contactNo: '',
          status: 'Active',
          address: '',
        });
      } else {
        alert('Error saving staff details');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Staff Account Management</h2>

      <label>
        Name:
        <input
          type="text"
          name="staffName"
          value={form.staffName}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Role:
        <input
          type="text"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Salary:
        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          min="0"
          required
        />
      </label>
      <br />

      <label>
        Contact No:
        <input
          type="text"
          name="contactNo"
          value={form.contactNo}
          onChange={handleChange}
          pattern="\d{10}"
          title="Enter 10-digit contact number"
          required
        />
      </label>
      <br />

      <label>
        Address:
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Status:
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default StaffForm;
