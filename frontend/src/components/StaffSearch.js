import React, { useState } from 'react';

// Sample staff data
const staffList = [
  { name: 'Alice', role: 'Admin' },
  { name: 'Bob', role: 'Cashier' },
  { name: 'Charlie', role: 'Inventory Manager' },
  { name: 'David', role: 'Loan officer' },
  { name: 'Eva', role: 'Sales person' },
  { name: 'Frank', role: 'Delivery Person' },
];

const StaffSearch = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === '' || staff.role === roleFilter)
  );

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
        <option value="Admin">Admin</option>
        <option value="Cashier">Cashier</option>
        <option value="Inventory Manager">Inventory Manager</option>
        <option value="Loan officer">Loan officer</option>
        <option value="Sales person">Sales person</option>
        <option value="Delivery Person">Delivery Person</option>
      </select>
      <ul>
        {filteredStaff.map((staff, idx) => (
          <li key={idx}>{staff.name} - {staff.role}</li>
        ))}
      </ul>
    </div>
  );
};

export default StaffSearch;