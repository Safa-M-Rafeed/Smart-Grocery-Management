import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./pages/AdminLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import StaffDashboard from "./pages/StaffDashboard";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import AdminStaff from "./pages/AdminStaff";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProfile from "./pages/AdminProfile";
import WorkSchedules from "./pages/WorkScheduleDashboard";
import PayrollDashboard from "./pages/PayrollDashboard";
import PerformanceDashboard from "./pages/PerformanceDashboard"; // ✅ Newly added
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Router> 
      <Routes>
        {/* 🌐 Public Site Routes */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* 🧭 Admin Dashboard Routes */}
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
            path="/attendance-dashboard"
            element={
              <ProtectedRoute role="Admin">
                <AttendanceDashboard />
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
            path="/admin/profile"
            element={
              <ProtectedRoute role="Admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          {/* 🕒 Work Schedules Route */}
          <Route
            path="/admin/work-schedules"
            element={ 
              <ProtectedRoute role="Admin">
                <WorkSchedules />
              </ProtectedRoute>
            }
          />
          
          {/* 📈 Performance Records Route */}
          <Route
            path="/admin/performance"
            element={
              <ProtectedRoute role="Admin">
                <PerformanceDashboard />
              </ProtectedRoute>
            }
          />

          {/* 💰 Payroll Route */}
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute role="Admin">
                <PayrollDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
