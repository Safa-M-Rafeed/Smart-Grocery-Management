// frontend/src/pages/AdminProfile.jsx
import React, { useEffect, useState } from "react";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  // Fetch admin profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setFormData({ name: data.name, email: data.email, contactNo: data.contactNo, password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile(data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full border px-2 py-1 rounded"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (leave blank if no change)"
            className="w-full border px-2 py-1 rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Contact No:</strong> {profile.contactNo}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-3 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
