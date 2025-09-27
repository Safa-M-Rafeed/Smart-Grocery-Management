import React, { useEffect, useState } from 'react';

const StaffList = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/staff')
      .then(res => res.json())
      .then(data => setStaff(data))
      .catch(err => console.error('Error fetching staff:', err));
  }, []);

  return (
    <div>
      <h2>Staff Records</h2>
      {staff.length === 0 ? (
        <p>No staff records found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Contact No</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s._id}>
                <td>{s.staffName}</td>
                <td>{s.email}</td>
                <td>{s.role}</td>
                <td>{s.salary}</td>
                <td>{s.contactNo}</td>
                <td>{s.address || '-'}</td>
                <td>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffList;
