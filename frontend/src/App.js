import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./pages/AdminLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import StaffDashboard from "./pages/StaffDashboard";
import AdminStaff from "./pages/AdminStaff";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProfile from "./pages/AdminProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Admin/Staff pages */}
        <Route element={<AdminLayout />}>
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
                <div>Attendance Dashboard Page</div>
              </ProtectedRoute>
            }
          />
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
