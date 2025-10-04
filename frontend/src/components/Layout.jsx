import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaUserCircle,
} from "react-icons/fa";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null); // Logged-in user info
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Fetch user info for navbar
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Default nav links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
  ];

  // Staff Management Subsystem links (for Admin)
  const staffLinks = [
    { name: "Dashboard", path: "/staff-dashboard" },
    { name: "Staff Management", path: "/admin/staff" },
    { name: "Attendance", path: "/attendance-dashboard" },
  ];

  // Determine which nav links to show
  const linksToRender = role === "Admin" ? staffLinks : navLinks;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-[#537D5D] text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            SmartGrocery
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {linksToRender.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className={`hover:text-[#D2D0A0] font-medium transition ${
                  location.pathname === link.path
                    ? "underline underline-offset-4"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Profile / Login */}
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user?.profileImage ? (
                    <img
                      src={`http://localhost:4000/uploads/profiles/${user.profileImage}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={28} />
                  )}
                  <span>{user?.name || role}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded shadow-lg z-50">
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-[#D2D0A0] text-[#537D5D] px-4 py-2 rounded-lg font-semibold hover:bg-[#9EBC8A] transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-[#537D5D] px-4 py-2 rounded-lg font-semibold hover:bg-[#D2D0A0] transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#537D5D] px-6 pb-4 space-y-3">
            {linksToRender.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block text-white font-medium hover:text-[#D2D0A0] transition ${
                  location.pathname === link.path ? "underline underline-offset-4" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            {token ? (
              <div>
                <Link
                  to="/admin/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white hover:text-[#D2D0A0] px-4 py-2"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white hover:text-[#D2D0A0]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-[#D2D0A0] text-[#537D5D] px-4 py-2 rounded-lg font-semibold hover:bg-[#9EBC8A] transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-white text-[#537D5D] px-4 py-2 rounded-lg font-semibold hover:bg-[#D2D0A0] transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#73946B] text-white mt-12">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-4">About SmartGrocery</h4>
            <p className="text-gray-100">
              All-in-one grocery management platform for staff, customers, and owners.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="hover:text-[#D2D0A0] transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sitemap */}
          <div>
            <h4 className="font-bold text-lg mb-4">Sitemap</h4>
            <ul className="space-y-2">
              <li>Customers</li>
              <li>Staff</li>
              <li>Admin</li>
              <li>Delivery</li>
              <li>Loans</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-[#D2D0A0] transition"><FaFacebook /></a>
              <a href="#" className="hover:text-[#D2D0A0] transition"><FaInstagram /></a>
              <a href="#" className="hover:text-[#D2D0A0] transition"><FaLinkedin /></a>
            </div>
          </div>
        </div>
        <div className="bg-[#537D5D] text-center py-4 text-gray-100">
          &copy; 2025 SmartGrocery. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
