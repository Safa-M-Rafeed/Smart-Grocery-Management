// frontend/src/pages/StaffForm.jsx
import React, { useState } from "react";

const StaffForm = ({ onSubmit, initialData = {} }) => {
  const [staffName, setStaffName] = useState(initialData.staffName || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [role, setRole] = useState(initialData.role || "");
  const [salary, setSalary] = useState(initialData.salary || "");
  const [contactNo, setContactNo] = useState(initialData.contactNo || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ staffName, email, role, salary, contactNo, address, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={staffName}
        onChange={(e) => setStaffName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <input
        type="text"
        placeholder="Contact Number"
        value={contactNo}
        onChange={(e) => setContactNo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default StaffForm;
