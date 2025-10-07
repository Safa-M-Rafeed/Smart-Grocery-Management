import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // attaches autoTable to jsPDF

const palette = {
  darkGreen: "#537D5D",
  green: "#73946B",
  lightGreen: "#9EBC8A",
  beige: "#D2D0A0",
};

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [history, setHistory] = useState([]);
  const [manualCheckIn, setManualCheckIn] = useState("");
  const [manualCheckOut, setManualCheckOut] = useState("");
  const token = localStorage.getItem("token");

  // Fetch today's attendance
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff's full attendance history
  const fetchHistory = async (staffId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/attendance/staff/${staffId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch attendance history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle check-in/check-out buttons
  const handleAttendance = async (staffId, type) => {
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
      fetchAttendance();
      if (selectedStaff && selectedStaff.staffId === staffId) fetchHistory(staffId);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle manual attendance submission
  const handleAddTodayAttendance = async () => {
    if (!selectedStaff) return alert("Select a staff first");
    try {
      const res = await fetch(`http://localhost:4000/api/attendance/${selectedStaff.staffId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkIn: manualCheckIn || null,
          checkOut: manualCheckOut || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to add attendance");
      alert("Attendance added successfully!");
      setManualCheckIn("");
      setManualCheckOut("");
      fetchAttendance();
      fetchHistory(selectedStaff.staffId);
    } catch (err) {
      alert(err.message);
    }
  };

  // CSV download
  const downloadCSV = () => {
    if (!history.length) return;
    const headers = ["Date", "Check-In", "Check-Out", "Hours Worked"];
    const rows = history.map((h) => [
      h.date,
      h.checkIn ? new Date(h.checkIn).toLocaleTimeString() : "-",
      h.checkOut ? new Date(h.checkOut).toLocaleTimeString() : "-",
      h.hoursWorked || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedStaff.staffName}-attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF download
  const downloadPDF = () => {
    if (!history.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Attendance History - ${selectedStaff.staffName}`, 10, 20);
    doc.setFontSize(12);

    const rows = history.map((h) => [
      h.date,
      h.checkIn ? new Date(h.checkIn).toLocaleTimeString() : "-",
      h.checkOut ? new Date(h.checkOut).toLocaleTimeString() : "-",
      h.hoursWorked || 0,
    ]);

    doc.autoTable({
      head: [["Date", "Check-In", "Check-Out", "Hours Worked"]],
      body: rows,
      startY: 30,
    });

    doc.save(`${selectedStaff.staffName}-attendance.pdf`);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Stats calculation
  const stats = {
    present: attendance.filter((s) => s.checkIn && s.checkOut).length,
    halfDay: attendance.filter((s) => s.checkIn && !s.checkOut).length,
    absent: attendance.filter((s) => !s.checkIn && !s.checkOut).length,
    sick: attendance.filter((s) => s.status === "sick").length,
  };

  const filteredAttendance = attendance.filter((s) =>
    s.staffName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="p-4">Loading attendance...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6" style={{ backgroundColor: palette.beige, minHeight: "100vh" }}>
      <h2 style={{ color: palette.darkGreen }} className="text-3xl font-bold mb-4">
        Attendance Dashboard
      </h2>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow" style={{ flex: 1 }}>
          <h3 className="font-semibold text-lg">Present</h3>
          <p className="text-xl">{stats.present}</p>
        </div>
        <div className="bg-white p-4 rounded shadow" style={{ flex: 1 }}>
          <h3 className="font-semibold text-lg">Half Day</h3>
          <p className="text-xl">{stats.halfDay}</p>
        </div>
        <div className="bg-white p-4 rounded shadow" style={{ flex: 1 }}>
          <h3 className="font-semibold text-lg">Absent</h3>
          <p className="text-xl">{stats.absent}</p>
        </div>
        <div className="bg-white p-4 rounded shadow" style={{ flex: 1 }}>
          <h3 className="font-semibold text-lg">Sick</h3>
          <p className="text-xl">{stats.sick}</p>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search staff..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-3 py-2 border rounded shadow focus:outline-none focus:ring-2"
      />

      {/* Today's Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
        <table className="min-w-full border-collapse">
          <thead style={{ backgroundColor: palette.green, color: "white" }}>
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Check-In</th>
              <th className="py-3 px-4">Check-Out</th>
              <th className="py-3 px-4">Hours Worked</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No staff found.
                </td>
              </tr>
            ) : (
              filteredAttendance.map((s) => (
                <tr
                  key={s.staffId}
                  className="border-t hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedStaff(s)}
                >
                  <td className="py-3 px-4">{s.staffName}</td>
                  <td className="py-3 px-4">{s.role}</td>
                  <td className="py-3 px-4">
                    {s.checkIn ? new Date(s.checkIn).toLocaleTimeString() : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {s.checkOut ? new Date(s.checkOut).toLocaleTimeString() : "-"}
                  </td>
                  <td className="py-3 px-4">{s.hoursWorked || 0}</td>
                  <td className="py-3 px-4 text-center">
                    {!s.checkIn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAttendance(s.staffId, "checkIn");
                        }}
                        className="px-3 py-1 rounded shadow text-white"
                        style={{ backgroundColor: palette.darkGreen }}
                      >
                        Check-In
                      </button>
                    )}
                    {s.checkIn && !s.checkOut && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAttendance(s.staffId, "checkOut");
                        }}
                        className="px-3 py-1 rounded shadow text-white ml-2"
                        style={{ backgroundColor: palette.green }}
                      >
                        Check-Out
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Staff History & Manual Attendance */}
      {selectedStaff && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">
              {selectedStaff.staffName} - Attendance History
            </h3>
            <div className="flex gap-2">
              <button
                onClick={downloadPDF}
                className="px-3 py-1 rounded text-white shadow"
                style={{ backgroundColor: palette.darkGreen }}
              >
                Download PDF
              </button>
              <button
                onClick={downloadCSV}
                className="px-3 py-1 rounded text-white shadow"
                style={{ backgroundColor: palette.green }}
              >
                Download CSV
              </button>
            </div>
          </div>

          {/* Manual Attendance Form */}
          <div className="flex items-center gap-2 mb-4">
            <label>Check-In:</label>
            <input
              type="time"
              value={manualCheckIn}
              onChange={(e) => setManualCheckIn(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <label>Check-Out:</label>
            <input
              type="time"
              value={manualCheckOut}
              onChange={(e) => setManualCheckOut(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={handleAddTodayAttendance}
              className="px-3 py-1 rounded text-white shadow"
              style={{ backgroundColor: palette.darkGreen }}
            >
              Add Attendance
            </button>
          </div>

          {/* History Table */}
          <table className="min-w-full border-collapse">
            <thead style={{ backgroundColor: palette.lightGreen }}>
              <tr>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Check-In</th>
                <th className="py-2 px-3">Check-Out</th>
                <th className="py-2 px-3">Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-2 text-gray-500">
                    No history found.
                  </td>
                </tr>
              ) : (
                history.map((h, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-3">{h.date}</td>
                    <td className="py-2 px-3">
                      {h.checkIn ? new Date(h.checkIn).toLocaleTimeString() : "-"}
                    </td>
                    <td className="py-2 px-3">
                      {h.checkOut ? new Date(h.checkOut).toLocaleTimeString() : "-"}
                    </td>
                    <td className="py-2 px-3">{h.hoursWorked || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
