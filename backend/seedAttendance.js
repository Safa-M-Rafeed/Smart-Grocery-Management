// frontend/src/pages/AttendanceDashboard.jsx
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const palette = {
  darkGreen: "#537D5D",
  green: "#73946B",
  lightGreen: "#9EBC8A",
  beige: "#D2D0A0",
};

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAttendance = async (date) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/attendance/all?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      setAttendance(data);
      setFilteredAttendance(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const filtered = attendance.filter((a) =>
      a.staffName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttendance(filtered);
  }, [searchTerm, attendance]);

  const handleCheck = async (staffId, type) => {
    try {
      const res = await fetch(`http://localhost:4000/api/attendance/${staffId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) throw new Error("Failed to update attendance");
      fetchAttendance(selectedDate);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewHistory = async (staff) => {
    setSelectedStaff(staff);
    try {
      const res = await fetch(
        `http://localhost:4000/api/attendance/staff/${staff.staffId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch staff history");
      const data = await res.json();
      setSelectedStaff({ ...staff, history: data });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedStaff || !selectedStaff.history) return;
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${selectedStaff.staffName}`, 14, 20);
    const tableColumn = ["Date", "Check-In", "Check-Out", "Hours Worked"];
    const tableRows = [];

    selectedStaff.history.forEach((rec) => {
      const rowData = [
        rec.date,
        rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : "-",
        rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : "-",
        rec.hoursWorked || 0,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save(`${selectedStaff.staffName}_attendance.pdf`);
  };

  const totalStaff = attendance.length;
  const presentToday = attendance.filter((a) => a.checkIn).length;
  const absentToday = totalStaff - presentToday;
  const halfDays = attendance.filter((a) => a.hoursWorked && a.hoursWorked < 4).length;

  if (loading) return <p className="p-4">Loading attendance...</p>;
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
          Attendance Dashboard
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          <label>Date: </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Search staff..."
            className="border px-3 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div
          className="rounded-lg p-5 text-center shadow"
          style={{ backgroundColor: palette.lightGreen }}
        >
          <p className="text-sm text-gray-700">Total Staff</p>
          <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
        </div>
        <div
          className="rounded-lg p-5 text-center shadow"
          style={{ backgroundColor: palette.green, color: "white" }}
        >
          <p className="text-sm">Present Today</p>
          <p className="text-3xl font-bold">{presentToday}</p>
        </div>
        <div
          className="rounded-lg p-5 text-center shadow"
          style={{ backgroundColor: "#C05C5C", color: "white" }}
        >
          <p className="text-sm">Absent Today</p>
          <p className="text-3xl font-bold">{absentToday}</p>
        </div>
        <div
          className="rounded-lg p-5 text-center shadow"
          style={{ backgroundColor: "#F1C40F", color: "black" }}
        >
          <p className="text-sm">Half Days</p>
          <p className="text-3xl font-bold">{halfDays}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead
            style={{ backgroundColor: palette.green, color: "white" }}
            className="text-left"
          >
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Check-In</th>
              <th className="py-3 px-4">Check-Out</th>
              <th className="py-3 px-4">Hours Worked</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No attendance data.
                </td>
              </tr>
            ) : (
              filteredAttendance.map((a) => (
                <tr
                  key={a.staffId}
                  className="border-t hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleViewHistory(a)}
                >
                  <td className="py-3 px-4">{a.staffName}</td>
                  <td className="py-3 px-4">{a.role}</td>
                  <td className="py-3 px-4">
                    {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : "-"}
                  </td>
                  <td className="py-3 px-4">{a.hoursWorked || 0}</td>
                  <td className="py-3 px-4 flex gap-2">
                    {selectedDate === new Date().toISOString().split("T")[0] && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheck(a.staffId, "checkIn");
                          }}
                          className="px-2 py-1 rounded text-white"
                          style={{ backgroundColor: palette.lightGreen }}
                        >
                          Check-In
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheck(a.staffId, "checkOut");
                          }}
                          className="px-2 py-1 rounded text-white"
                          style={{ backgroundColor: palette.green }}
                        >
                          Check-Out
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Staff History */}
      {selectedStaff && selectedStaff.history && (
        <div className="mt-8 bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-bold mb-4" style={{ color: palette.darkGreen }}>
            {selectedStaff.staffName} - Attendance History
          </h3>
          <button
            className="mb-4 px-4 py-2 rounded text-white"
            style={{ backgroundColor: palette.green }}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
          <table className="min-w-full border-collapse">
            <thead style={{ backgroundColor: palette.lightGreen }}>
              <tr>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Check-In</th>
                <th className="py-2 px-4">Check-Out</th>
                <th className="py-2 px-4">Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {selectedStaff.history.map((rec, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{rec.date}</td>
                  <td className="py-2 px-4">
                    {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : "-"}
                  </td>
                  <td className="py-2 px-4">
                    {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : "-"}
                  </td>
                  <td className="py-2 px-4">{rec.hoursWorked || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
