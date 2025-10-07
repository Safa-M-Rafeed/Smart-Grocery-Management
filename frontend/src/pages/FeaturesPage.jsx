// src/pages/FeaturesPage.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { Navigation, Autoplay } from "swiper/modules";

// Import your images
import Feature1 from "../assets/Feature1.jpg";
import Feature2 from "../assets/Feature2.jpg";
import Feature3 from "../assets/Feature3.jpg";
import Feature4 from "../assets/Feature4.jpg";
import Feature5 from "../assets/Feature5.jpg";
import Feature6 from "../assets/Feature6.jpg";

const features = [
  { title: "Smart Inventory", desc: "Keep real-time track of stock with automated low-stock alerts.", img: Feature1 },
  { title: "Sales Analytics", desc: "Get detailed insights and reports to make data-driven decisions.", img: Feature2 },
  { title: "Customer Loyalty", desc: "Reward your regular customers with loyalty points and discounts.", img: Feature3 },
  { title: "Delivery Tracking", desc: "Manage and track orders with integrated delivery support.", img: Feature4 },
  { title: "Staff Management", desc: "Track attendance, performance, and roles of your staff easily.", img: Feature5 },
  { title: "Multi-Platform Access", desc: "Access SmartGrocery from desktop, tablet, or mobile seamlessly.", img: Feature6 },
];

const FeaturesPage = () => {
  return (
    <div className="py-20 bg-[#F8F9FA]">
      <h2 className="text-4xl font-bold text-center text-[#537D5D] mb-12">Our Core Features</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {features.map((feature, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition transform hover:-translate-y-2">
              <img
                src={feature.img}
                alt={feature.title}
                className="w-40 h-40 md:w-48 md:h-48 object-contain mb-6 rounded-xl"
              />
              <h3 className="text-xl font-semibold text-[#537D5D] mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturesPage;
