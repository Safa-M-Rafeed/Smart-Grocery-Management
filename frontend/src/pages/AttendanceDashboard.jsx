import React, { useEffect, useState } from "react";

const AttendanceDashboard = () => {
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAttendance = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/attendance/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
      setRecords([]);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/attendance/checkin", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await res.json();
      fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/attendance/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await res.json();
      fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-[#537D5D] mb-4">Attendance</h2>

      <div className="mb-4 space-x-4">
        <button onClick={handleCheckIn} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Check In</button>
        <button onClick={handleCheckOut} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Check Out</button>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-[#537D5D] text-white">
          <tr>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Check In</th>
            <th className="py-2 px-4">Check Out</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{new Date(rec.date).toLocaleDateString()}</td>
              <td className="py-2 px-4">{rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : "-"}</td>
              <td className="py-2 px-4">{rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : "-"}</td>
              <td className="py-2 px-4">{rec.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDashboard;
