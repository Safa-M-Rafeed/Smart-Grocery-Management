// frontend/src/pages/StaffDashboard.jsx
import React, { useEffect, useState } from "react";

const palette = {
  darkGreen: "#537D5D",
  green: "#73946B",
  lightGreen: "#9EBC8A",
  beige: "#D2D0A0",
};

const roleColors = {
  Admin: "bg-red-100 text-red-700",
  Cashier: "bg-blue-100 text-blue-700",
  "Inventory Clerk": "bg-yellow-100 text-yellow-700",
  "Loan Officer": "bg-purple-100 text-purple-700",
  "Delivery Person": "bg-green-100 text-green-700",
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
    <div
      className="p-6 rounded-md shadow-inner"
      style={{ backgroundColor: palette.beige, minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-3">
        <h2
          className="text-3xl font-bold tracking-wide"
          style={{ color: palette.darkGreen }}
        >
          Staff Management
        </h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search staff..."
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2"
            style={{ borderColor: palette.green }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 font-semibold rounded shadow hover:opacity-90 transition"
            style={{
              backgroundColor: palette.darkGreen,
              color: "white",
            }}
          >
            + Add Staff
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div
          className="rounded-lg p-5 text-center shadow"
          style={{ backgroundColor: palette.lightGreen }}
        >
          <p className="text-sm text-gray-700">Total Staff</p>
          <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
        </div>
        <div
          className="rounded-lg p-5 text-center shadow"
          style={{ backgroundColor: palette.green }}
        >
          <p className="text-sm text-white">Active Staff</p>
          <p className="text-3xl font-bold text-white">{activeStaff}</p>
        </div>
        <div
          className="rounded-lg p-5 text-center shadow"
          style={{ backgroundColor: palette.darkGreen, color: "white" }}
        >
          <p className="text-sm opacity-90">Inactive Staff</p>
          <p className="text-3xl font-bold">{inactiveStaff}</p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead
            style={{ backgroundColor: palette.green, color: "white" }}
            className="text-left"
          >
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No staff found.
                </td>
              </tr>
            ) : (
              filteredStaff.map((s) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{s.staffName}</td>
                  <td className="py-3 px-4">{s.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        roleColors[s.role] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{s.contactNo}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(s)}
                      className="px-3 py-1 rounded font-semibold transition text-white"
                      style={{
                        backgroundColor:
                          s.status === "Active"
                            ? palette.green
                            : "#C05C5C",
                      }}
                    >
                      {s.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="px-3 py-1 rounded shadow text-white"
                      style={{ backgroundColor: palette.lightGreen }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(s._id)}
                      className="px-3 py-1 rounded shadow text-white"
                      style={{ backgroundColor: "#C05C5C" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: palette.darkGreen }}
            >
              {editStaff ? "Edit Staff" : "Add New Staff"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {["staffName", "email", "role", "salary", "contactNo", "address"].map(
                (field) => (
                  <input
                    key={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    className="w-full border px-3 py-2 rounded focus:ring focus:border-green-300"
                    required={["staffName", "email", "role", "contactNo"].includes(
                      field
                    )}
                  />
                )
              )}
              {!editStaff && (
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded font-semibold text-white shadow"
                  style={{ backgroundColor: palette.darkGreen }}
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
