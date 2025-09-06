import React, { useState } from 'react';

const StaffForm = () => {
  const [form, setForm] = useState({
    staffName: '',
    role: '',
    salary: '',
    contactNo: '',
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
          role: '',
          salary: '',
          contactNo: '',
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
          required
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default StaffForm;