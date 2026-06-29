import { Routes, Route } from "react-router-dom";

import LoginPage from "../../pages/auth/Login";
import RegisterPage from "../../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../../layouts/AdminLayout";
import AdminDashboard from "../../features/admin/pages/AdminDashboard";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Home */}

      <Route path="/" element={<div>Home</div>} />

      {/* Admin */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}