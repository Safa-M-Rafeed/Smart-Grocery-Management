import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkScheduleDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [date, setDate] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [newShift, setNewShift] = useState({ shiftName: "", startTime: "", endTime: "" });

  const BASE_URL = "http://localhost:4000/api";
  const token = localStorage.getItem("token"); // JWT token from login

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all shifts
        const shiftsRes = await axios.get(`${BASE_URL}/work-schedules`);
        setShifts(shiftsRes.data);

        // Fetch all staff (protected route, need token)
        const staffRes = await axios.get(`${BASE_URL}/staffs/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStaff(staffRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to load shifts or staff.");
      }
    };
    fetchData();
  }, [token]);

  const createShift = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/work-schedules`, newShift);
      alert("Shift created!");
      const shiftsRes = await axios.get(`${BASE_URL}/work-schedules`);
      setShifts(shiftsRes.data);
      setNewShift({ shiftName: "", startTime: "", endTime: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create shift.");
    }
  };

  const assignShift = async (e) => {
    e.preventDefault();
    if (!selectedStaff || !selectedShift || !date) {
      alert("Please select staff, shift, and date.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/work-schedules/assign`, {
        staffId: selectedStaff,
        shiftId: selectedShift,
        date,
      });
      alert("Shift assigned!");
      setSelectedStaff("");
      setSelectedShift("");
      setDate("");
    } catch (err) {
      console.error(err);
      alert("Failed to assign shift.");
    }
  };

  const viewSchedule = async (id) => {
    if (!id) return setSchedules([]);
    try {
      const res = await axios.get(`${BASE_URL}/work-schedules/staff/${id}`);
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch schedules.");
    }
  };

  return (
    <div className="container mx-auto mt-6 space-y-6" style={{ backgroundColor: "#D2D0A0", minHeight: "100vh", padding: "1rem" }}>
      <h2 className="text-3xl font-bold text-[#537D5D] mb-6">Work Schedule Management</h2>

      {/* Create Shift */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: "#9EBC8A" }}>
        <h4 className="text-xl font-semibold mb-4 text-[#537D5D]">Create Shift</h4>
        <form onSubmit={createShift} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <input type="text" placeholder="Shift Name" value={newShift.shiftName} onChange={(e) => setNewShift({ ...newShift, shiftName: e.target.value })} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#537D5D]" />
          <input type="time" value={newShift.startTime} onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#537D5D]" />
          <input type="time" value={newShift.endTime} onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#537D5D]" />
          <button type="submit" className="bg-[#537D5D] text-white px-4 py-2 rounded hover:bg-[#73946B] transition">Create</button>
        </form>
      </div>

      {/* Assign Shift */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: "#9EBC8A" }}>
        <h4 className="text-xl font-semibold mb-4 text-[#537D5D]">Assign Shift</h4>
        <form onSubmit={assignShift} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#537D5D]">
            <option value="">Select Staff</option>
            {staff.map((s) => (<option key={s._id} value={s._id}>{s.staffName}</option>))}
          </select>

          <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#537D5D]">
            <option value="">Select Shift</option>
            {shifts.map((shift) => (<option key={shift._id} value={shift._id}>{shift.shiftName}</option>))}
          </select>

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#537D5D]" />
          <button type="submit" className="bg-[#537D5D] text-white px-4 py-2 rounded hover:bg-[#73946B] transition">Assign</button>
        </form>
      </div>

      {/* View Schedule */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: "#9EBC8A" }}>
        <h4 className="text-xl font-semibold mb-4 text-[#537D5D]">View Schedule per Staff</h4>
        <select onChange={(e) => viewSchedule(e.target.value)} className="border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#537D5D]">
          <option value="">Select Staff</option>
          {staff.map((s) => (<option key={s._id} value={s._id}>{s.staffName}</option>))}
        </select>

        <table className="min-w-full border-collapse border border-[#537D5D]">
          <thead className="bg-[#73946B] text-white">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Shift</th>
              <th className="border px-4 py-2">Start</th>
              <th className="border px-4 py-2">End</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[#D2D0A0]" : "bg-[#9EBC8A]"}>
                <td className="border px-4 py-2">{new Date(s.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{s.shiftId.shiftName}</td>
                <td className="border px-4 py-2">{s.shiftId.startTime}</td>
                <td className="border px-4 py-2">{s.shiftId.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkScheduleDashboard;
