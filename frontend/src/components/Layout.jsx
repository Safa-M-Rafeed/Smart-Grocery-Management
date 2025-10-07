import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Fetch logged-in user info
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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Shop", path: "/shop" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-[#537D5D] text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            SmartGrocery
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-[#D2D0A0] font-medium transition ${
                  location.pathname === link.path ? "underline underline-offset-4" : ""
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

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#537D5D] px-6 pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
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
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-white hover:text-[#D2D0A0]"
              >
                Logout
              </button>
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
      <footer className="bg-[#537D5D] text-white text-center py-4 mt-6">
        <p>© {new Date().getFullYear()} SmartGrocery. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
