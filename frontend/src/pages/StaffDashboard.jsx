import React, { useEffect, useState } from "react";

const roleColors = {
  Admin: "bg-red-200 text-red-800",
  Cashier: "bg-blue-200 text-blue-800",
  "Inventory Clerk": "bg-yellow-200 text-yellow-800",
  "Loan Officer": "bg-purple-200 text-purple-800",
  "Delivery Person": "bg-green-200 text-green-800",
};

const StaffDashboard = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [formData, setFormData] = useState({
    staffName: "",
    email: "",
    role: "",
    salary: "",
    contactNo: "",
    address: "",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/staffs/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpenModal = (staff = null) => {
    if (staff) {
      setEditStaff(staff);
      setFormData({
        staffName: staff.staffName,
        email: staff.email,
        role: staff.role,
        salary: staff.salary,
        contactNo: staff.contactNo,
        address: staff.address,
        password: "",
      });
    } else {
      setEditStaff(null);
      setFormData({
        staffName: "",
        email: "",
        role: "",
        salary: "",
        contactNo: "",
        address: "",
        password: "",
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editStaff
        ? `http://localhost:4000/api/staffs/${editStaff._id}`
        : "http://localhost:4000/api/staffs";
      const method = editStaff ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save staff");
      fetchStaff();
      setModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (staff) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/staffs/${staff._id}/status`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to toggle status");
      fetchStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/staffs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete staff");
      fetchStaff();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.status === "Active").length;
  const inactiveStaff = staff.filter((s) => s.status === "Inactive").length;

  if (loading) return <p className="p-4">Loading staff...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Total Staff</p>
          <p className="text-2xl font-bold">{totalStaff}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Active Staff</p>
          <p className="text-2xl font-bold">{activeStaff}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Inactive Staff</p>
          <p className="text-2xl font-bold">{inactiveStaff}</p>
        </div>
      </div>

      {/* Header + Search + Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Staff Dashboard</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, email, role"
            className="border rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            + Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Contact</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No staff found
              </td>
            </tr>
          ) : (
            filteredStaff.map((s) => (
              <tr key={s._id} className="text-center">
                <td className="py-2 px-4 border-b">{s.staffName}</td>
                <td className="py-2 px-4 border-b">{s.email}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      roleColors[s.role] || "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {s.role}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">{s.contactNo}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleToggleStatus(s)}
                    className={`px-3 py-1 rounded text-white font-semibold transition ${
                      s.status === "Active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {s.status}
                  </button>
                </td>
                <td className="py-2 px-4 border-b flex justify-center gap-2">
                  <button
                    onClick={() => handleOpenModal(s)}
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(s._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal - same as before */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-bold mb-4">
              {editStaff ? "Edit Staff" : "Add Staff"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                name="staffName"
                value={formData.staffName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Role"
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary"
                type="number"
                className="w-full border px-2 py-1 rounded"
              />
              <input
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="Contact No"
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border px-2 py-1 rounded"
              />
              {!editStaff && (
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
