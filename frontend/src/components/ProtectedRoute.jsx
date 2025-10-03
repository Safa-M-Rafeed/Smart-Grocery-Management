// frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * @param {ReactNode} children - The component(s) to render if authorized
 * @param {string} role - Optional: required role (e.g., "Admin")
 */
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Save role in localStorage on login

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Logged in but not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
