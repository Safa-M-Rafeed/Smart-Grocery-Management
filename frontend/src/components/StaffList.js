import React, { useEffect, useState } from 'react';

const StaffList = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/staff')
      .then(res => res.json())
      .then(data => setStaff(data));
  }, []);

  return (
    <div>
      <h2>Staff Records</h2>
      <ul>
        {staff.map((s) => (
          <li key={s._id}>
            {s.staffName} | {s.role} | {s.salary} | {s.contactNo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffList;