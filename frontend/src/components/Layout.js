// src/components/Layout.js
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-800 font-poppins">
      {/* 🌐 Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 text-white md:px-16 bg-primary1">
        <h1 className="text-2xl font-bold">SmartGrocery</h1>
        <ul className="hidden space-x-6 md:flex">
          <li>
            <Link to="/" className="transition hover:text-primary4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="transition hover:text-primary4">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/features" className="transition hover:text-primary4">
              Features
            </Link>
          </li>
          <li>
            <Link to="/shop" className="transition hover:text-primary4">
              Shop
            </Link>
          </li>
          <li>
            <Link to="/contact" className="transition hover:text-primary4">
              Contact Us
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span className="hidden sm:block">{user.name}</span>
                <span className="px-2 py-1 text-xs rounded bg-primary3 text-primary1">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 space-x-2 transition rounded-lg bg-primary4 hover:bg-red-600 text-primary1"
              >
                <LogOut size={16} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 ml-4 transition rounded-lg bg-primary3 text-primary1 hover:bg-primary2 hover:text-white"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* 📄 Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ⚓ Footer */}
      <footer className="px-8 py-10 text-white md:px-16 bg-primary2">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h4 className="mb-4 font-bold">SmartGrocery</h4>
            <p>
              A smarter way to shop, manage, and deliver groceries across Sri
              Lanka.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary4">
                FB
              </a>
              <a href="#" className="hover:text-primary4">
                Insta
              </a>
              <a href="#" className="hover:text-primary4">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm text-center">
          © {new Date().getFullYear()} SmartGrocery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

