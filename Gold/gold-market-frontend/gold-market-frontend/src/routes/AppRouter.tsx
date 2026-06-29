import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import GoldShopLayout from "../layouts/GoldShopLayout";

import ProtectedRoute from "./ProtectedRoute";
import GoldShopRoute from "./GoldShopRoute";
import ApprovedUserRoute from "./ApprovedUserRoute";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminUsersPage from "../features/admin/pages/AdminUsersPage";
import AdminGoldShopsPage from "../features/admin/pages/AdminGoldShopsPage";
import AdminProductsPage from "../features/admin/pages/AdminProductsPage";
import AdminOrdersPage from "../features/admin/pages/AdminOrdersPage";

// Auth
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";

// Public
import HomePage from "../pages/public/HomePage";
import ProductsPage from "../pages/public/ProductsPage";
import ProductDetailPage from "../pages/public/ProductDetailPage";
import AboutPage from "../pages/public/AboutPage";

// User
import ProfilePage from "../pages/user/ProfilePage";
import EditProfilePage from "../pages/user/EditProfilePage";
import MyProductsPage from "../pages/user/MyProductsPage";
import MyOrdersPage from "../pages/user/MyOrdersPage";
import MySalesPage from "../pages/user/MySalesPage";
import OrderDetailPage from "../pages/user/OrderDetailPage";
import OrderSuccessPage from "../pages/user/OrderSuccessPage";

// Order flow
import CreateOrderPage from "../pages/order/CreateOrderPage";
import OrderTrackingPage from "../pages/order/OrderTrackingPage";

// GoldShop
import DashboardPage from "../pages/goldshop/DashboardPage";
import OrdersListPage from "../pages/goldshop/OrdersListPage";
import GoldShopOrderDetailPage from "../pages/goldshop/GoldShopOrderDetailPage";
import AnalyticsPage from "../pages/goldshop/AnalyticsPage";

// Notifications
import NotificationsPage from "../pages/notifications/NotificationsPage";

// System
import UnauthorizedPage from "../pages/system/UnauthorizedPage";
import NotFoundPage from "../pages/system/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Auth (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Main public/user layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/my-products" element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="/my-sales" element={<ProtectedRoute><MySalesPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/order/success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        <Route path="/create-order/:productId" element={<ApprovedUserRoute><CreateOrderPage /></ApprovedUserRoute>} />
        <Route path="/order-tracking/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
      </Route>

      {/* GoldShop dashboard layout */}
      <Route path="/goldshop" element={<GoldShopRoute><GoldShopLayout /></GoldShopRoute>}>
        <Route index element={<Navigate to="/goldshop/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersListPage filter="all" />} />
        <Route path="orders/reserved" element={<OrdersListPage filter="reserved" />} />
        <Route path="orders/completed" element={<OrdersListPage filter="completed" />} />
        <Route path="orders/:id" element={<GoldShopOrderDetailPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Admin dashboard layout */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="goldshops" element={<AdminGoldShopsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
