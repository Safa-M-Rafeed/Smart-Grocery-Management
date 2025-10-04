//
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">SmartGrocery</Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className={`hover:text-[#D2D0A0] font-medium transition ${
                  location.pathname === link.path ? "underline underline-offset-4" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
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
            {navLinks.map((link, i) => (
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
