<<<<<<< Updated upstream
import React from 'react';
import StaffForm from './components/StaffForm';
import StaffSearch from './components/StaffSearch';
import StaffList from './components/StaffList';
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import StaffDashboard from "./pages/StaffDashboard";
import AdminStaff from "./pages/AdminStaff";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
>>>>>>> Stashed changes

function App() {
  return (
    <div>
      <StaffForm />
      <StaffSearch />
      <StaffList />

<<<<<<< Updated upstream
    </div>
=======
          {/* Staff Dashboard */}
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute>
                <StaffDashboard />
                <ToastContainer position="top-right" autoClose={3000} />
              </ProtectedRoute>
            }
          />

          {/* Admin Staff Management */}
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute role="Admin">
                <AdminStaff />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;