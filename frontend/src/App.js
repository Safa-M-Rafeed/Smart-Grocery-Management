// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import StaffDashboard from "./pages/StaffDashboard";
import AdminStaff from "./pages/AdminStaff";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProfile from "./pages/AdminProfile"; // New Profile Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Pages */}
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Staff Management Subsystem - Admin Only */}
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute role="Admin">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute role="Admin">
                <AdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance-dashboard"
            element={
              <ProtectedRoute role="Admin">
                {/* You can create an AttendanceDashboard page */}
                <div>Attendance Dashboard Page</div>
              </ProtectedRoute>
            }
          />

          {/* Admin Profile Page */}
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="Admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
