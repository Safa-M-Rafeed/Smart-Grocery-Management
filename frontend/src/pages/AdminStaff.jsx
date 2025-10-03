import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffForm from "./StaffForm";

const AdminStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [editStaff, setEditStaff] = useState(null);
  const token = localStorage.getItem("token"); // JWT token after admin login

  const fetchStaff = async () => {
    try {
      const res = await axios.get("/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleStatusToggle = async (id) => {
    try {
      await axios.patch(`/api/staff/status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="staff-management">
      <h1>Staff Management</h1>
      <StaffForm refresh={fetchStaff} editStaff={editStaff} setEditStaff={setEditStaff} />
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Contact</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(staff => (
            <tr key={staff._id}>
              <td>{staff.staffName}</td>
              <td>{staff.email}</td>
              <td>{staff.role}</td>
              <td>{staff.contactNo}</td>
              <td>{staff.status}</td>
              <td>
                <button onClick={() => setEditStaff(staff)}>Edit</button>
                <button onClick={() => handleStatusToggle(staff._id)}>
                  {staff.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStaff;
