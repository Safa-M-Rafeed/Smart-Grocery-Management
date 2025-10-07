import React from "react";
import { FaLeaf, FaBullseye, FaHandsHelping } from "react-icons/fa";
import Team from "../assets/Team.jpg";
import Team1 from "../assets/Team1.jpg";
import Team2 from "../assets/Team2.jpg";
import Team3 from "../assets/Team3.jpg";
import Team4 from "../assets/Team4.jpg";
import Team5 from "../assets/Team5.jpg";

const AboutPage = () => {
  const teamMembers = [
    { name: "Safa M Rafeed", role: "Admin", img: Team1 },
    { name: "Ishani", role: "Cashier", img: Team2 },
    { name: "Sithmi", role: "Inventory Staff", img: Team3 },
    { name: "Amish", role: "Delivery Staff", img: Team4 },
    { name: "Buddhi", role: "Loan Officer", img: Team5 },
  ];

  return (
    <div className="bg-[#D2D0A0] text-[#3A4E3C]">
      {/* Hero Section */}
      <section className="relative text-center py-20 bg-gradient-to-r from-[#537D5D] to-[#9EBC8A] text-white">
        <h1 className="text-5xl font-bold mb-4">About SmartGrocery</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Revolutionizing the way you shop — with smart insights, effortless management, and
          sustainable choices.
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#D2D0A0] rounded-t-[50%]" />
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          Founded with a vision to simplify daily grocery shopping, SmartGrocery was created to
          empower users with smarter ways to plan, shop, and manage their essentials. We believe
          grocery management shouldn’t be a hassle — it should be smart, sustainable, and
          stress-free.
        </p>
        <div className="mt-10">
          <img
            src={Team} // Replace with a group image if you have one
            alt="SmartGrocery Team"
            className="w-full max-w-4xl mx-auto rounded-xl shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-[#9EBC8A] py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-10 text-white">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
            <FaBullseye size={40} className="text-[#537D5D] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p>
              To simplify grocery management through intelligent systems that save time, reduce
              waste, and create meaningful shopping experiences.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
            <FaLeaf size={40} className="text-[#537D5D] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p>
              We value eco-friendly practices by promoting efficient shopping habits that minimize
              food waste and encourage mindful consumption.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition">
            <FaHandsHelping size={40} className="text-[#537D5D] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Commitment</h3>
            <p>
              We’re dedicated to building technology that empowers users and businesses alike,
              ensuring trust and reliability every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 md:px-20 text-center bg-[#D2D0A0]">
        <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition transform hover:-translate-y-1"
            >
              <div className="overflow-hidden rounded-full w-28 h-28 mx-auto mb-4 border-4 border-[#9EBC8A]">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              <h3 className="font-semibold text-xl text-[#537D5D]">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#537D5D] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Smart Shopping Revolution</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Whether you’re a shopper or a business, SmartGrocery helps you stay one step ahead with
          smarter technology and sustainable solutions.
        </p>
        <button className="bg-[#D2D0A0] text-[#537D5D] px-6 py-3 rounded-lg font-semibold hover:bg-[#9EBC8A] transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default AboutPage;
