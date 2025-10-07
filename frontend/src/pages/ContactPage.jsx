// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send data to backend API
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-16 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-center text-[#537D5D] mb-12">
        Contact Us
      </h2>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-[#537D5D] text-3xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-[#537D5D]">Address</h3>
              <p>123 SmartGrocery St, Grocery City, Country</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaPhone className="text-[#537D5D] text-3xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-[#537D5D]">Phone</h3>
              <p>+123 456 7890</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaEnvelope className="text-[#537D5D] text-3xl mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-[#537D5D]">Email</h3>
              <p>support@smartgrocery.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
          {submitted && (
            <p className="text-green-600 font-semibold">
              Thank you! Your message has been sent.
            </p>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9EBC8A]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9EBC8A]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9EBC8A]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#D2D0A0] text-[#537D5D] px-6 py-3 rounded-lg font-semibold hover:bg-[#9EBC8A] transition w-full"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
