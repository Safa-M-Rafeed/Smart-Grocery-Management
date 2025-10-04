// frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * @param {ReactNode} children - Component(s) to render if authorized
 * @param {string} role - Optional: required role (e.g., "Admin")
 * @param {string} subsystem - Optional: required subsystem (e.g., "staff")
 */
const ProtectedRoute = ({ children, role, subsystem }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Store role on login
  const userSubsystem = localStorage.getItem("subsystem"); // Store subsystem on login

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Subsystem mismatch
  if (subsystem && userSubsystem !== subsystem) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
