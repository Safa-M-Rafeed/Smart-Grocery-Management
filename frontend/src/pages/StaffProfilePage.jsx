import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StaffProfilePage = () => {
  const [staff, setStaff] = useState(null);
  const [form, setForm] = useState({ name: "", contactNo: "", address: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/staff-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStaff(data);
        setForm({ name: data.name || "", contactNo: data.contactNo || "", address: data.address || "", password: "" });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/staff-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setMessage("Profile updated successfully!");
      setStaff(data);
      setForm({ ...form, password: "" }); // clear password
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!staff) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 mb-3 border rounded"
        />
        <input
          type="text"
          name="contactNo"
          value={form.contactNo}
          onChange={handleChange}
          placeholder="Contact No"
          className="w-full p-3 mb-3 border rounded"
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password (leave blank to keep)"
          className="w-full p-3 mb-3 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-[#537D5D] text-white p-3 rounded hover:bg-green-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default StaffProfilePage;
