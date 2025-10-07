// src/pages/ShopPage.jsx
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import product1 from "../assets/product1.jpg"; // Replace with actual product images
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import product4 from "../assets/product4.jpg";

const ShopPage = () => {
  const [products, setProducts] = useState([]);

  // Example products (replace with fetch from backend later)
  useEffect(() => {
    const fetchProducts = async () => {
      // Replace with your API call
      const data = [
        { id: 1, name: "Fresh Apples", price: 3.99, img: product1 },
        { id: 2, name: "Organic Bananas", price: 2.49, img: product2 },
        { id: 3, name: "Milk 1L", price: 1.99, img: product3 },
        { id: 4, name: "Bread Loaf", price: 2.99, img: product4 },
      ];
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // You can integrate your cart logic here
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-16 px-6 md:px-16">
      <h2 className="text-4xl font-bold text-center text-[#537D5D] mb-12">Shop Our Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold text-[#537D5D] mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-[#D2D0A0] text-[#537D5D] w-full py-2 rounded-lg font-semibold hover:bg-[#9EBC8A] transition flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
