import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
  FaCog,
  FaMoneyBill, // ✅ Added icon for Payroll
} from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col"
        style={{ backgroundColor: "#537D5D", color: "white" }}
      >
        {/* Header / Profile */}
        <div className="p-6 text-center border-b border-green-700">
          {user?.profileImage ? (
            <img
              src={`http://localhost:4000/uploads/profiles/${user.profileImage}`}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto object-cover mb-2"
            />
          ) : (
            <FaUserCircle size={72} className="mx-auto mb-2" />
          )}
          <h3 className="text-xl font-bold">{user?.name || role}</h3>
          <p className="text-sm opacity-90">{user?.role || ""}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/staff-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded hover:bg-[#73946B] transition ${
                isActive ? "bg-[#73946B]" : ""
              }`
            }
          >
            <FaUsers /> <span>Manage Staff</span>
          </NavLink>

          <NavLink
            to="/attendance-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded hover:bg-[#73946B] transition ${
                isActive ? "bg-[#73946B]" : ""
              }`
            }
          >
            <FaFileAlt /> <span>Attendance</span>
          </NavLink>

          {/* Work Schedules */}
          <NavLink
            to="/admin/work-schedules"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded hover:bg-[#73946B] transition ${
                isActive ? "bg-[#73946B]" : ""
              }`
            }
          >
            <FaCalendarAlt /> <span>Work Schedules</span>
          </NavLink>

          {/* Payroll */}
          <NavLink
            to="/admin/payroll"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded hover:bg-[#73946B] transition ${
                isActive ? "bg-[#73946B]" : ""
              }`
            }
          >
            <FaMoneyBill /> <span>Payroll</span>
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded hover:bg-[#73946B] transition ${
                isActive ? "bg-[#73946B]" : ""
              }`
            }
          >
            <FaCog /> <span>Profile</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="m-4 p-2 rounded font-semibold transition"
          style={{ backgroundColor: "#9EBC8A", color: "#537D5D" }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6" style={{ backgroundColor: "#D2D0A0" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
