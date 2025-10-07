import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const palette = {
  darkGreen: "#537D5D",
  green: "#73946B",
  lightGreen: "#9EBC8A",
  beige: "#D2D0A0",
};

const PerformanceDashboard = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const tableRef = useRef();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/performance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch performance records");
      const data = await res.json();
      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const filtered = records.filter(
      (r) =>
        r.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const handleDownloadPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Performance_Records.pdf");
  };

  if (loading) return <p className="p-4">Loading performance records...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div
      className="p-6 rounded-md shadow-inner"
      style={{ backgroundColor: palette.beige, minHeight: "100vh" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: palette.darkGreen }}>
          Performance Records
        </h2>
        <input
          type="text"
          placeholder="Search staff..."
          className="border px-3 py-1 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 rounded text-white"
          style={{ backgroundColor: palette.green }}
        >
          Download PDF
        </button>
      </div>

      <div ref={tableRef} className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead style={{ backgroundColor: palette.green, color: "white" }}>
            <tr>
              <th className="py-2 px-4">Staff Name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Review Date</th>
              <th className="py-2 px-4">Overall Rating</th>
              <th className="py-2 px-4">Reviewer</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{r.staffName}</td>
                  <td className="py-2 px-4">{r.role}</td>
                  <td className="py-2 px-4">{r.reviewDate}</td>
                  <td className="py-2 px-4">{r.overallRating}</td>
                  <td className="py-2 px-4">{r.reviewer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
