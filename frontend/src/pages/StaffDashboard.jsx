// frontend/src/pages/StaffDashboard.jsx
import React, { useEffect, useState } from "react";

const roles = ["Admin", "Cashier", "Inventory Clerk", "Loan Officer", "Delivery Person"];

const StaffDashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState({ visible: false, staffId: null, action: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    staffName: "",
    email: "",
    role: "",
    salary: "",
    contactNo: "",
    address: "",
    password: "",
  });
  const [editingStaffId, setEditingStaffId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchStaff = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/staffs?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStaffList(Array.isArray(data.staff) ? data.staff : []);
      else setError(data.message || "Failed to fetch staff list");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingStaffId
        ? `http://localhost:4000/api/staffs/${editingStaffId}`
        : "http://localhost:4000/api/staffs";
      const method = editingStaffId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      setFormData({ staffName: "", email: "", role: "", salary: "", contactNo: "", address: "", password: "" });
      setEditingStaffId(null);
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaffId(staff._id);
    setFormData({
      staffName: staff.staffName,
      email: staff.email,
      role: staff.role,
      salary: staff.salary,
      contactNo: staff.contactNo,
      address: staff.address,
      password: "",
    });
    setShowModal(true);
  };

  const handleConfirmAction = (staffId, action) => {
    setShowConfirm({ visible: true, staffId, action });
  };

  const executeAction = async () => {
    const { staffId, action } = showConfirm;
    try {
      let url = `http://localhost:4000/api/staffs/${staffId}`;
      let method = "";

      if (action === "delete") method = "DELETE";
      else if (action === "toggle") {
        method = "PATCH";
        url += "/status";
      }

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed");

      fetchStaff();
    } catch (err) {
      alert(err.message);
    } finally {
      setShowConfirm({ visible: false, staffId: null, action: "" });
    }
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="p-8 text-center text-lg">Loading...</p>;

  return (
    <div className="p-8">
      {/* Header + Add Staff Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold text-[#537D5D]">Staff Dashboard</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded flex-grow"
          />
          <button
            onClick={() => { setShowModal(true); setEditingStaffId(null); }}
            className="bg-[#537D5D] text-white px-4 py-2 rounded hover:bg-[#73946B] transition"
          >
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto bg-white rounded shadow-md">
        <table className="min-w-full">
          <thead className="bg-[#537D5D] text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{staff.staffName}</td>
                <td className="py-2 px-4">{staff.email}</td>
                <td className="py-2 px-4">{staff.role}</td>
                <td className="py-2 px-4">{staff.salary}</td>
                <td className="py-2 px-4">{staff.contactNo}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      staff.status === "Active" ? "bg-[#9EBC8A] text-white" : "bg-[#EB5757] text-white"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(staff)}
                    className="bg-[#73946B] px-2 py-1 rounded text-white hover:bg-[#537D5D] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleConfirmAction(staff._id, "toggle")}
                    className={`px-2 py-1 rounded text-white ${
                      staff.status === "Active" ? "bg-[#EB5757] hover:bg-[#D2D0A0]" : "bg-[#9EBC8A] hover:bg-[#537D5D]"
                    } transition`}
                  >
                    {staff.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleConfirmAction(staff._id, "delete")}
                    className="bg-[#EB5757] px-2 py-1 rounded text-white hover:bg-[#D2D0A0] transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">{editingStaffId ? "Edit Staff" : "Add Staff"}</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <input type="text" name="staffName" placeholder="Full Name" value={formData.staffName} onChange={handleChange} className="p-2 border rounded" required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded" required />
              <select name="role" value={formData.role} onChange={handleChange} className="p-2 border rounded" required>
                <option value="">Select Role</option>
                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="p-2 border rounded" required />
              <input type="text" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} className="p-2 border rounded" required />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-2 border rounded" />
              {!editingStaffId && <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-2 border rounded" required />}
              <button type="submit" className="col-span-1 md:col-span-2 bg-[#537D5D] text-white p-2 rounded hover:bg-[#73946B] transition">
                {editingStaffId ? "Update Staff" : "Add Staff"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center relative">
            <p className="mb-4 font-semibold">
              Are you sure you want to {showConfirm.action === "delete" ? "delete" : "toggle status of"} this staff?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={executeAction} className="bg-[#537D5D] text-white px-4 py-2 rounded hover:bg-[#73946B] transition">Yes</button>
              <button onClick={() => setShowConfirm({ visible: false, staffId: null, action: "" })} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
