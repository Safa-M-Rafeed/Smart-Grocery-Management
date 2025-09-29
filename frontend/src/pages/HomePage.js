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
        <div className="md:w-1/2 space-y-6">
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
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://source.unsplash.com/600x400/?groceries,market"
            alt="Groceries"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="text-center px-8 md:px-16 py-16 bg-white">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-6">
          What is SmartGrocery?
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 mb-10">
          SmartGrocery is a complete grocery management system for customers,
          staff, and business owners. Manage inventory, sales, staff, delivery,
          and loans seamlessly.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <ShoppingCart size={40} className="text-[#73946B]" />
            <p className="mt-2">Shopping</p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={40} className="text-[#73946B]" />
            <p className="mt-2">Staff</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck size={40} className="text-[#73946B]" />
            <p className="mt-2">Delivery</p>
          </div>
          <div className="flex flex-col items-center">
            <CreditCard size={40} className="text-[#73946B]" />
            <p className="mt-2">Loans</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 md:px-16 py-16 bg-[#F5F5F0] text-center">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-10">
          Our Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            "Staff Management",
            "Sales & Billing",
            "Inventory Management",
            "Delivery Tracking",
            "Loan & Loyalty Management",
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="font-semibold text-lg">{feature}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-8 md:px-16 py-16 bg-white text-center">
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
            <li key={index} className="flex items-center space-x-3 justify-center">
              <CheckCircle className="text-[#73946B]" />
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
        <p className="max-w-2xl mx-auto text-gray-600 mb-6">
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
      <section className="px-8 md:px-16 py-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#537D5D] mb-10">
          What People Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <h2 className="text-3xl font-bold mb-6">
          Join thousands of happy customers and staff already managing groceries
          smarter.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
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