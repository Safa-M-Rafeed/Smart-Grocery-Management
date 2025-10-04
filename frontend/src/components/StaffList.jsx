import React, { useEffect, useState } from "react";
import { getAllStaff, toggleStaffStatus } from "../services/api";
import StaffForm from "./StaffForm";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await getAllStaff({ page, limit, search });
      setStaff(res.data.staff);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStaff(); }, [page, search]);

  const handleToggleStatus = async (id) => {
    await toggleStaffStatus(id);
    fetchStaff();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input 
          type="text" 
          placeholder="Search by name, email, role"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-sm"
        />
        <button
          onClick={() => { setSelectedStaff(null); setShowForm(true); }}
          className="ml-4 bg-[#537D5D] text-white px-4 py-2 rounded hover:bg-[#73946B]"
        >
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#537D5D] text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s._id} className="border-b hover:bg-[#D2D0A0]/20">
                <td className="p-2">{s.staffID}</td>
                <td className="p-2">{s.staffName}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.role}</td>
                <td className="p-2">{s.status}</td>
                <td className="p-2">{s.contactNo}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => { setSelectedStaff(s); setShowForm(true); }}
                    className="bg-[#73946B] text-white px-2 py-1 rounded hover:bg-[#9EBC8A]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(s._id)}
                    className="bg-[#D2D0A0] text-[#537D5D] px-2 py-1 rounded hover:bg-[#9EBC8A]"
                  >
                    {s.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && 
        <StaffForm 
          staff={selectedStaff} 
          onClose={() => { setShowForm(false); fetchStaff(); }}
        />}
    </div>
  );
};

export default StaffList;
