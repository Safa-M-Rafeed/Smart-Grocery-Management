import React, { useEffect, useState } from "react";

const StaffDashboard = () => {
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("staffToken");
        const res = await fetch("http://localhost:4000/api/staff-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Ensure we always set an array
        setStaffList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setStaffList([]); // fallback
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-[#537D5D] mb-6">Staff Dashboard</h2>

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-[#537D5D] text-white">
          <tr>
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Role</th>
            <th className="py-3 px-6">Salary</th>
            <th className="py-3 px-6">Contact</th>
            <th className="py-2 px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff._id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-6">{staff.staffName}</td>
              <td className="py-2 px-6">{staff.email}</td>
              <td className="py-2 px-6">{staff.role}</td>
              <td className="py-2 px-6">{staff.salary}</td>
              <td className="py-2 px-6">{staff.contactNo}</td>
              <td className="py-2 px-6">{staff.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDashboard;
