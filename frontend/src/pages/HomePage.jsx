import React from "react";
import { FaBoxOpen, FaChartLine, FaUsers, FaTruck, FaUserShield, FaMobileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";

const HomePage = () => {
  const features = [
    {
      icon: <FaBoxOpen className="text-4xl text-[#537D5D]" />,
      title: "Smart Inventory",
      desc: "Monitor your stock in real-time with automated restock alerts.",
    },
    {
      icon: <FaChartLine className="text-4xl text-[#537D5D]" />,
      title: "Sales Analytics",
      desc: "Gain valuable insights with detailed visual reports and KPIs.",
    },
    {
      icon: <FaUsers className="text-4xl text-[#537D5D]" />,
      title: "Customer Loyalty",
      desc: "Build stronger relationships with loyalty points and discounts.",
    },
    {
      icon: <FaTruck className="text-4xl text-[#537D5D]" />,
      title: "Delivery Tracking",
      desc: "Track and manage deliveries with real-time status updates.",
    },
    {
      icon: <FaUserShield className="text-4xl text-[#537D5D]" />,
      title: "Staff Management",
      desc: "Easily manage staff roles, attendance, and performance.",
    },
    {
      icon: <FaMobileAlt className="text-4xl text-[#537D5D]" />,
      title: "Multi-Platform Access",
      desc: "Access SmartGrocery from any device — mobile, tablet, or desktop.",
    },
  ];

  return (
    <div className="font-sans">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#537D5D] via-[#73946B] to-[#9EBC8A] text-white py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              SmartGrocery – Smarter Way to Shop & Manage
            </h1>
            <p className="text-lg md:text-xl max-w-xl">
              One platform for customers, staff, and business owners. Shop efficiently, track inventory, and manage your business seamlessly.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                to="/shop"
                className="bg-[#D2D0A0] text-[#537D5D] px-6 py-3 rounded-lg font-semibold hover:bg-[#9EBC8A] transition shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/login"
                className="bg-white text-[#537D5D] px-6 py-3 rounded-lg font-semibold hover:bg-[#D2D0A0] transition shadow-lg"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="flex justify-center relative">
            <img
              src={img2}
              alt="Groceries"
              className="w-80 md:w-[450px] rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#537D5D] leading-tight">
              SmartGrocery – The Smarter Way to Manage Your Store
            </h2>
            <p className="text-gray-700 text-lg md:text-xl">
              SmartGrocery is a professional grocery management platform that integrates customers, staff, and business owners — making operations simpler, faster, and smarter.
            </p>
            <Link
              to="/features"
              className="inline-block mt-4 bg-[#D2D0A0] text-[#537D5D] px-6 py-3 rounded-lg font-semibold hover:bg-[#9EBC8A] transition shadow-md"
            >
              Explore Features
            </Link>
          </div>

          <div className="flex justify-center relative">
            <img
              src={img1}
              alt="About SmartGrocery"
              className="w-full md:w-[450px] rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#9EBC8A]/10 rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#537D5D] mb-12">
            Our Core Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300"
              >
                <div className="mb-6 flex justify-center">{f.icon}</div>
                <h3 className="text-xl font-semibold text-[#537D5D] mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#537D5D] mb-10">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Jane Doe", role: "Customer", text: "SmartGrocery makes shopping so easy and quick!" },
              { name: "John Smith", role: "Staff", text: "Managing inventory and staff has never been simpler." },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-[#D2D0A0] p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
              >
                <p className="text-gray-800 italic">"{t.text}"</p>
                <h4 className="mt-4 font-semibold text-[#537D5D]">{t.name}</h4>
                <p className="text-gray-600 text-sm">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#537D5D] text-white py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto">
          Join thousands of happy customers and staff already managing groceries smarter.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="bg-[#D2D0A0] text-[#537D5D] px-6 py-3 rounded-lg font-semibold hover:bg-[#9EBC8A] transition shadow-lg"
          >
            Register Now
          </Link>
          <Link
            to="/login"
            className="bg-[#73946B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#9EBC8A] transition shadow-lg"
          >
            Login
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
