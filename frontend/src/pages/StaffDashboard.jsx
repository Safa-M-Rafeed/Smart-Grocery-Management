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
  const [expandedCard, setExpandedCard] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState({}); // key: staffId

  const token = localStorage.getItem("token");

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/staffs`, {
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

  useEffect(() => { fetchStaff(); }, []);

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

  const handleConfirmAction = (staffId, action) => setShowConfirm({ visible: true, staffId, action });

  const executeAction = async () => {
    const { staffId, action } = showConfirm;
    try {
      let url = `http://localhost:4000/api/staffs/${staffId}`;
      let method = "";

      if (action === "delete") method = "DELETE";
      else if (action === "toggle") { method = "PATCH"; url += "/status"; }

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

  // Fetch individual staff attendance summary
  const fetchAttendanceSummary = async (staffId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/attendance/summary/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttendanceSummary((prev) => ({ ...prev, [staffId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async (staffId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/attendance/checkin/${staffId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Check-in failed");
      fetchAttendanceSummary(staffId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckOut = async (staffId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/attendance/checkout/${staffId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Check-out failed");
      fetchAttendanceSummary(staffId);
    } catch (err) {
      alert(err.message);
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
    <div className="p-8 space-y-6">
      {/* Header + Add Staff */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
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

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <div key={staff._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 relative">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-bold">{staff.staffName}</h3>
                <p className="text-sm text-gray-600">{staff.role}</p>
              </div>
              <span className={`px-2 py-1 rounded text-white text-xs ${staff.status === "Active" ? "bg-[#9EBC8A]" : "bg-[#EB5757]"}`}>
                {staff.status}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={() => handleEdit(staff)} className="bg-[#73946B] px-2 py-1 rounded text-white hover:bg-[#537D5D] transition text-sm">Edit</button>
              <button onClick={() => handleConfirmAction(staff._id, "toggle")} className={`px-2 py-1 rounded text-white text-sm ${staff.status === "Active" ? "bg-[#EB5757]" : "bg-[#9EBC8A]"}`}>
                {staff.status === "Active" ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => handleConfirmAction(staff._id, "delete")} className="bg-[#EB5757] px-2 py-1 rounded text-white hover:bg-[#D2D0A0] transition text-sm">Delete</button>
            </div>

            {/* Expandable Attendance Panel */}
            <button
              onClick={() => {
                setExpandedCard(expandedCard === staff._id ? null : staff._id);
                if (expandedCard !== staff._id) fetchAttendanceSummary(staff._id);
              }}
              className="text-sm text-[#537D5D] hover:underline mb-2"
            >
              {expandedCard === staff._id ? "Hide Attendance" : "Show Attendance"}
            </button>

            {expandedCard === staff._id && (
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
                <p className="text-sm font-semibold">Attendance:</p>
                <div className="flex gap-2">
                  <button onClick={() => handleCheckIn(staff._id)} className="bg-[#537D5D] text-white px-2 py-1 rounded text-xs hover:bg-[#73946B]">Check In</button>
                  <button onClick={() => handleCheckOut(staff._id)} className="bg-[#537D5D] text-white px-2 py-1 rounded text-xs hover:bg-[#73946B]">Check Out</button>
                </div>
                {attendanceSummary[staff._id] && (
                  <div className="text-xs text-gray-600 mt-2">
                    <p>Today: {attendanceSummary[staff._id].today ? `${new Date(attendanceSummary[staff._id].today.checkIn).toLocaleTimeString()} - ${attendanceSummary[staff._id].today.checkOut ? new Date(attendanceSummary[staff._id].today.checkOut).toLocaleTimeString() : "--"}` : "--"}</p>
                    <p>Weekly Hours: {attendanceSummary[staff._id].weeklyHours}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>✖</button>
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
              <button type="submit" className="col-span-1 md:col-span-2 bg-[#537D5D] text-white p-2 rounded hover:bg-[#73946B] transition">{editingStaffId ? "Update Staff" : "Add Staff"}</button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center relative">
            <p className="mb-4 font-semibold">Are you sure you want to {showConfirm.action === "delete" ? "delete" : "toggle status of"} this staff?</p>
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
