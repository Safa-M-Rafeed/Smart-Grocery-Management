// frontend/src/components/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Fetch logged-in staff/admin info
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:4000/api/staff/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Logo / Profile */}
        <div className="text-center py-6 border-b border-gray-700">
          {user?.profileImage ? (
            <img
              src={`http://localhost:4000/uploads/profiles/${user.profileImage}`}
              alt="Profile"
              className="w-16 h-16 mx-auto rounded-full object-cover mb-2"
            />
          ) : (
            <FaUserCircle size={64} className="mx-auto mb-2" />
          )}
          <h2 className="text-lg font-bold">{user?.name || role}</h2>
          <p className="text-sm text-gray-400">{user?.role || role}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-4">
          <NavLink
            to="/staff-dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Staff Dashboard
          </NavLink>
          {role === "Admin" && (
            <>
              <NavLink
                to="/admin/staff"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                Manage Staff
              </NavLink>
              <NavLink
                to="/attendance-dashboard"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded hover:bg-gray-700 ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                Attendance
              </NavLink>
            </>
          )}
          {role !== "Admin" && (
            <NavLink
              to="/my-attendance"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              My Attendance
            </NavLink>
          )}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="m-4 p-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
