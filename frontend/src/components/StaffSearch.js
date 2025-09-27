import React, { useEffect, useState } from 'react';

const StaffSearch = () => {
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch staff data from backend
  useEffect(() => {
    fetch('http://localhost:4000/api/staff')
      .then(res => res.json())
      .then(data => setStaffList(data))
      .catch(err => console.error('Error fetching staff:', err));
  }, []);

  const filteredStaff = staffList.filter(staff =>
    staff.staffName.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === '' || staff.role === roleFilter) &&
    (statusFilter === '' || staff.status === statusFilter)
  );

  // Extract unique roles dynamically
  const roles = [...new Set(staffList.map(staff => staff.role))];
  const statuses = ['Active', 'Inactive'];

  return (
    <div>
      <h2>Search & Filter Staff Records</h2>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
        <option value="">All Roles</option>
        {roles.map((role, idx) => (
          <option key={idx} value={role}>{role}</option>
        ))}
      </select>

      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="">All Statuses</option>
        {statuses.map((status, idx) => (
          <option key={idx} value={status}>{status}</option>
        ))}
      </select>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Contact No</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.length === 0 ? (
            <tr>
              <td colSpan="6">No staff records found.</td>
            </tr>
          ) : (
            filteredStaff.map((staff) => (
              <tr key={staff._id}>
                <td>{staff.staffName}</td>
                <td>{staff.email}</td>
                <td>{staff.role}</td>
                <td>{staff.contactNo}</td>
                <td>{staff.address || '-'}</td>
                <td>{staff.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffSearch;
