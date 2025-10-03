import React, { useEffect, useState } from "react";
import { fetchStaff, updateStaff, toggleStaffStatus, createStaff } from "../api";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ staffName: "", email: "", password: "", role: "", contactNo: "" });
  const [editForm, setEditForm] = useState(null); // edit state
  const [showModal, setShowModal] = useState(false);

  const loadStaff = async () => {
    const data = await fetchStaff();
    setStaffList(data);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    await createStaff(form);
    setForm({ staffName: "", email: "", password: "", role: "", contactNo: "" });
    loadStaff();
  };

  const handleToggleStatus = async (id) => {
    await toggleStaffStatus(id);
    loadStaff();
  };

  const openEditModal = (staff) => {
    setEditForm({ ...staff, password: "" }); // leave password empty for security
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const updateData = { ...editForm };
    if (!updateData.password) delete updateData.password; // don't update password if blank
    await updateStaff(editForm._id, updateData);
    setShowModal(false);
    loadStaff();
  };

  return (
    <div>
      <h2>Staff Management</h2>

      {/* Add Staff Form */}
      <div>
        <h3>Add Staff</h3>
        <input name="staffName" placeholder="Full Name" value={form.staffName} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
        <input name="contactNo" placeholder="Contact No" value={form.contactNo} onChange={handleChange} />
        <button onClick={handleCreate}>Add Staff</button>
      </div>

      {/* Staff List */}
      <div>
        <h3>All Staff</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id}>
                <td>{staff.staffName}</td>
                <td>{staff.email}</td>
                <td>{staff.role}</td>
                <td>{staff.status}</td>
                <td>
                  <button onClick={() => handleToggleStatus(staff._id)}>
                    {staff.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEditModal(staff)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{ background: "white", padding: "20px", width: "400px" }}>
            <h3>Edit Staff</h3>
            <input name="staffName" placeholder="Full Name" value={editForm.staffName} onChange={handleEditChange} />
            <input name="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} />
            <input name="password" placeholder="Password (leave blank to keep)" type="password" value={editForm.password} onChange={handleEditChange} />
            <input name="role" placeholder="Role" value={editForm.role} onChange={handleEditChange} />
            <input name="contactNo" placeholder="Contact No" value={editForm.contactNo} onChange={handleEditChange} />
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
