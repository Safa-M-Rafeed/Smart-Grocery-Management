import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import img2 from "../assets/img2.jpg"; // adjust path if your folder is different
import img1 from "../assets/img1.jpg";

const HomePage = () => {
  return (
    <div className="font-sans">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#537D5D] via-[#73946B] to-[#9EBC8A] text-white py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          
          {/* Left Text */}
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

          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#537D5D] leading-tight">
              SmartGrocery – The Smarter Way to Manage Your Store
            </h2>
            <p className="text-gray-700 text-lg md:text-xl">
              SmartGrocery is a professional grocery management platform designed to streamline operations for customers, staff, and business owners. 
              From inventory tracking and sales processing to delivery management and loyalty programs, everything is integrated for efficiency and growth.
            </p>
            <Link
              to="/features"
              className="inline-block mt-4 bg-[#D2D0A0] text-[#537D5D] px-6 py-3 rounded-lg font-semibold hover:bg-[#9EBC8A] transition shadow-md"
            >
              Explore Features
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex justify-center relative">
            <img
              src={img1} // your image
              alt="About SmartGrocery"
              className="w-full md:w-[450px] rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#9EBC8A]/10 rounded-2xl"></div> {/* subtle overlay */}
          </div>

        </div>
      </section>



            {/* Core Features Section */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#537D5D] mb-12">
            Our Core Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <img
                src={require("../assets/Feature1.jpg")}
                alt="Feature 1"
                className="w-20 h-20 mx-auto mb-6 object-contain"
              />
              <h3 className="text-xl font-semibold text-[#537D5D] mb-3">
                Smart Inventory
              </h3>
              <p className="text-gray-600">
                Keep real-time track of stock with automated low-stock alerts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <img
                src={require("../assets/Feature2.jpg")}
                alt="Feature 2"
                className="w-20 h-20 mx-auto mb-6 object-contain"
              />
              <h3 className="text-xl font-semibold text-[#537D5D] mb-3">
                Sales Analytics
              </h3>
              <p className="text-gray-600">
                Get detailed insights and reports to make data-driven decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <img
                src={require("../assets/Feature3.jpg")}
                alt="Feature 3"
                className="w-20 h-20 mx-auto mb-6 object-contain"
              />
              <h3 className="text-xl font-semibold text-[#537D5D] mb-3">
                Customer Loyalty
              </h3>
              <p className="text-gray-600">
                Reward your regular customers with loyalty points and discounts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <img
                src={require("../assets/Feature4.jpg")}
                alt="Feature 4"
                className="w-20 h-20 mx-auto mb-6 object-contain"
              />
              <h3 className="text-xl font-semibold text-[#537D5D] mb-3">
                Delivery Tracking
              </h3>
              <p className="text-gray-600">
                Manage and track orders with integrated delivery support.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <img
                src={require("../assets/Feature5.jpg")}
                alt="Feature 5"
                className="w-20 h-20 mx-auto mb-6 object-contain"
              />
              <h3 className="text-xl font-semibold text-[#537D5D] mb-3">
                Staff Management
              </h3>
              <p className="text-gray-600">
                Track attendance, performance, and roles of your staff easily.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <img
                src={require("../assets/Feature6.jpg")}
                alt="Feature 6"
                className="w-20 h-20 mx-auto mb-6 object-contain"
              />
              <h3 className="text-xl font-semibold text-[#537D5D] mb-3">
                Multi-Platform Access
              </h3>
              <p className="text-gray-600">
                Access SmartGrocery from desktop, tablet, or mobile seamlessly.
              </p>
            </div>

          </div>
        </div>
      </section>


            {/* Core Features Section */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#537D5D] mb-12">
            Our Core Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              "User-friendly Interface",
              "Real-time Inventory Tracking",
              "Secure Payment Integration",
              "Role-based Access Control",
              "Sales & Expense Reports",
              "Multi-device Compatibility",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <FaCheckCircle className="text-[#9EBC8A] text-3xl" />
                <span className="text-[#537D5D] font-semibold text-lg">{feature}</span>
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
            ].map((testimonial, i) => (
              <div key={i} className="bg-[#D2D0A0] p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <p className="text-gray-800">"{testimonial.text}"</p>
                <h4 className="mt-4 font-semibold text-[#537D5D]">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
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
