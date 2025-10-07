import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const palette = {
  darkGreen: "#537D5D",
  green: "#73946B",
  lightGreen: "#9EBC8A",
  beige: "#D2D0A0",
};

const PayrollDashboard = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [payroll, setPayroll] = useState([]);
  const token = localStorage.getItem("token");

  const payslipRef = useRef(null); // ref for generating PDF

  const BASE_URL = "http://localhost:4000/api";

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

  const downloadPaySlip = async (staffName) => {
    // Filter payroll for this staff
    const staffPayroll = payroll.filter((p) => p.staffName === staffName);
    if (staffPayroll.length === 0) return alert("No payroll data!");

    // Create hidden div to render payslip
    const payslipDiv = document.createElement("div");
    payslipDiv.style.padding = "20px";
    payslipDiv.style.backgroundColor = "#fff";
    payslipDiv.innerHTML = `
      <h2 style="color: ${palette.darkGreen}">Pay Slip - ${staffName}</h2>
      <p>Month: ${month}/${year}</p>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: ${palette.green}; color: #fff;">
          <tr>
            <th>Date</th>
            <th>Role</th>
            <th>Hours Worked</th>
            <th>Hourly Rate</th>
            <th>Net Pay</th>
          </tr>
        </thead>
        <tbody>
          ${staffPayroll
            .map(
              (p) => `
            <tr>
              <td>${p.date}</td>
              <td>${p.role}</td>
              <td>${p.hoursWorked}</td>
              <td>${p.hourlyRate}</td>
              <td>${p.netPay}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin-top:10px;">Total Net Pay: ${staffPayroll
        .reduce((sum, p) => sum + p.netPay, 0)
        .toFixed(2)}</p>
    `;
    document.body.appendChild(payslipDiv);

    // Capture as canvas
    const canvas = await html2canvas(payslipDiv);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${staffName}-PaySlip-${month}-${year}.pdf`);

    // Cleanup
    document.body.removeChild(payslipDiv);
  };

  return (
    <div
      className="container mx-auto mt-6 p-6 rounded-lg"
      style={{ backgroundColor: palette.beige, minHeight: "100vh" }}
    >
      <h2 className="text-3xl font-bold mb-6" style={{ color: palette.darkGreen }}>
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
            <tr key={i} className={i % 2 === 0 ? "bg-[#D2D0A0]" : "bg-[#9EBC8A]"}>
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
