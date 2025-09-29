// src/components/Layout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="font-poppins text-gray-800 flex flex-col min-h-screen">
      {/* 🌐 Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-4 bg-[#537D5D] text-white">
        <h1 className="text-2xl font-bold">SmartGrocery</h1>
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="hover:text-[#D2D0A0] transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-[#D2D0A0] transition">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/features" className="hover:text-[#D2D0A0] transition">
              Features
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-[#D2D0A0] transition">
              Shop
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-[#D2D0A0] transition">
              Contact Us
            </Link>
          </li>
        </ul>
        <Link
          to="/login"
          className="ml-4 bg-[#9EBC8A] px-4 py-2 rounded-lg hover:bg-[#73946B] transition"
        >
          Login
        </Link>
      </nav>

      {/* 📄 Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ⚓ Footer */}
      <footer className="px-8 md:px-16 py-10 bg-[#73946B] text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-4">SmartGrocery</h4>
            <p>
              A smarter way to shop, manage, and deliver groceries across Sri
              Lanka.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
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
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#D2D0A0]">
                FB
              </a>
              <a href="#" className="hover:text-[#D2D0A0]">
                Insta
              </a>
              <a href="#" className="hover:text-[#D2D0A0]">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          © {new Date().getFullYear()} SmartGrocery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

