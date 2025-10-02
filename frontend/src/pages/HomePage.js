// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Users,
  Truck,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center bg-[#F5F5F0] px-8 md:px-16 py-16">
        <div className="space-y-6 md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#537D5D]">
            SmartGrocery – Smarter Way to Shop & Manage
          </h1>
          <p className="text-lg text-gray-700">
            One platform for customers, staff, and business owners.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/shop"
              className="bg-[#73946B] text-white px-6 py-3 rounded-lg hover:bg-[#537D5D] transition duration-300"
            >
              Shop Now
            </Link>
            <Link
              to="/login"
              className="bg-[#D2D0A0] px-6 py-3 rounded-lg hover:bg-[#9EBC8A] transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="flex justify-center mt-10 md:w-1/2 md:mt-0">
          <img
            src="https://source.unsplash.com/600x400/?groceries,market"
            alt="Groceries"
            className="shadow-lg rounded-xl"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="px-8 py-16 text-center bg-white md:px-16">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-6">
          What is SmartGrocery?
        </h2>
        <p className="max-w-3xl mx-auto mb-10 text-gray-600">
          SmartGrocery is a complete grocery management system for customers,
          staff, and business owners. Manage inventory, sales, staff, delivery,
          and loans seamlessly.
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center">
            <ShoppingCart size={40} className="text-[#73946L]" />
            <p className="mt-2">Shopping</p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={40} className="text-[#73946L]" />
            <p className="mt-2">Staff</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck size={40} className="text-[#73946L]" />
            <p className="mt-2">Delivery</p>
          </div>
          <div className="flex flex-col items-center">
            <CreditCard size={40} className="text-[#73946L]" />
            <p className="mt-2">Loans</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 md:px-16 py-16 bg-[#F5F5F0] text-center">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-10">
          Our Core Features
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Staff Management */}
          <div className="p-6 transition duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
            <h3 className="text-lg font-semibold">Staff Management</h3>
          </div>
          {/* Sales & Billing - clickable */}
          <Link
            to="/sales-billing"
            className="block p-6 transition duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h3 className="text-lg font-semibold">Sales & Billing</h3>
          </Link>
          {/* Inventory Management */}
          <div className="p-6 transition duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
            <h3 className="text-lg font-semibold">Inventory Management</h3>
          </div>
          {/* Delivery Tracking */}
          <div className="p-6 transition duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
            <h3 className="text-lg font-semibold">Delivery Tracking</h3>
          </div>
          {/* Loan & Loyalty Management - clickable */}
          <Link
            to="/loan-loyalty-management"
            className="block p-6 transition duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h3 className="text-lg font-semibold">Loan & Loyalty Management</h3>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-8 py-16 text-center bg-white md:px-16">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-6">
          Why Choose SmartGrocery?
        </h2>
        <ul className="max-w-3xl mx-auto space-y-4 text-gray-700">
          {[
            "24/7 Online Shopping",
            "Role-based Dashboards",
            "Secure Payments",
            "Real-time Inventory",
            "Smooth Delivery",
          ].map((point, index) => (
            <li key={index} className="flex items-center justify-center space-x-3">
              <CheckCircle className="text-[#73946L]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Customer Section */}
      <section className="px-8 md:px-16 py-16 bg-[#F5F5F0] text-center">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-6">
          Shop Smarter with SmartGrocery
        </h2>
        <p className="max-w-2xl mx-auto mb-6 text-gray-600">
          Earn loyalty points, enjoy fast delivery, and place online orders
          effortlessly. Redeem points for discounts on your favorite groceries.
        </p>
        <Link
          to="/shop"
          className="bg-[#73946B] text-white px-6 py-3 rounded-lg hover:bg-[#537D5D] transition duration-300"
        >
          Start Shopping
        </Link>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-16 text-center bg-white md:px-16">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-10">
          What People Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-[#F5F5F0] p-6 rounded-xl shadow-md">
            <p className="italic text-gray-700">
              “SmartGrocery made my weekly shopping so much easier! Fast
              delivery and loyalty discounts are amazing.”
            </p>
            <p className="mt-4 font-semibold">– Customer</p>
          </div>
          <div className="bg-[#F5F5F0] p-6 rounded-xl shadow-md">
            <p className="italic text-gray-700">
              “Managing staff and inventory is smooth and stress-free with
              SmartGrocery.”
            </p>
            <p className="mt-4 font-semibold">– Staff Member</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-8 md:px-16 py-16 bg-[#537D5D] text-center text-white rounded-t-xl">
        <h2 className="mb-6 text-3xl font-bold">
          Join thousands of happy customers and staff already managing groceries
          smarter.
        </h2>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="bg-[#9EBC8A] text-gray-800 px-6 py-3 rounded-lg hover:bg-[#D2D0A0] transition duration-300"
          >
            Register Now
          </Link>
          <Link
            to="/login"
            className="bg-white text-[#537D5D] px-6 py-3 rounded-lg hover:bg-[#D2D0A0] transition duration-300"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}