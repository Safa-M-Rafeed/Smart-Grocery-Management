import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PayrollDashboard = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [payroll, setPayroll] = useState([]);

  const BASE_URL = "http://localhost:4000/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/staffs/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaff();
  }, [token]);

  const fetchPayroll = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/payroll`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { staffId: selectedStaff, month, year },
      });
      setPayroll(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch payroll");
    }
  };

  const downloadPaySlip = (staffName) => {
    if (payroll.length === 0) return alert("No payroll data to download!");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor("#537D5D");
    doc.text(`Pay Slip - ${staffName}`, 14, 22);
    doc.setFontSize(12);
    doc.setTextColor("#2F3E2F");
    doc.text(`Month: ${month}/${year}`, 14, 30);

    const tableColumn = ["Date", "Role", "Hours Worked", "Hourly Rate", "Net Pay"];
    const tableRows = [];

    payroll.forEach((p) => {
      if (p.staffName === staffName || !selectedStaff) {
        const row = [p.date, p.role, p.hoursWorked, p.hourlyRate, p.netPay];
        tableRows.push(row);
      }
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      headStyles: { fillColor: [83, 125, 93] }, // #537D5D
      alternateRowStyles: { fillColor: [158, 188, 138] }, // #9EBC8A
    });

    const totalPay = tableRows.reduce((sum, row) => sum + row[4], 0);
    doc.setTextColor("#537D5D");
    doc.text(`Total Net Pay: ${totalPay}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save(`${staffName}-PaySlip-${month}-${year}.pdf`);
  };

  return (
    <div
      className="container mx-auto mt-6 p-6 rounded-lg"
      style={{ backgroundColor: "#D2D0A0", minHeight: "100vh" }}
    >
      <h2 className="text-3xl font-bold mb-6 text-[#537D5D]">
        Payroll Management
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#537D5D]"
        >
          <option value="">All Staff</option>
          {staff.map((s) => (
            <option key={s._id} value={s._id}>
              {s.staffName}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={month}
          min="1"
          max="12"
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#537D5D]"
        />
        <input
          type="number"
          value={year}
          min="2020"
          max="2100"
          onChange={(e) => setYear(e.target.value)}
          className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#537D5D]"
        />
        <button
          onClick={fetchPayroll}
          className="bg-[#537D5D] text-white px-4 py-2 rounded hover:bg-[#73946B] transition"
        >
          Fetch Payroll
        </button>
      </div>

      {/* Payroll Table */}
      <table className="min-w-full border-collapse border border-[#537D5D]">
        <thead className="bg-[#537D5D] text-white">
          <tr>
            <th className="border px-4 py-2">Staff</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Hours Worked</th>
            <th className="border px-4 py-2">Hourly Rate</th>
            <th className="border px-4 py-2">Net Pay</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {payroll.map((p, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-[#D2D0A0]" : "bg-[#9EBC8A]"}
            >
              <td className="border px-4 py-2">{p.staffName}</td>
              <td className="border px-4 py-2">{p.role}</td>
              <td className="border px-4 py-2">{p.date}</td>
              <td className="border px-4 py-2">{p.hoursWorked}</td>
              <td className="border px-4 py-2">{p.hourlyRate}</td>
              <td className="border px-4 py-2">{p.netPay}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => downloadPaySlip(p.staffName)}
                  className="bg-[#537D5D] text-white px-2 py-1 rounded hover:bg-[#73946B] transition"
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollDashboard;
