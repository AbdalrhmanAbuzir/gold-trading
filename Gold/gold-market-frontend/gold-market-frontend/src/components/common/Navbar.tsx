import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../store/slices/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-amber-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏅</span>
          <span className="text-xl font-bold text-amber-600">GoldMarket</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/products" className="hover:text-amber-600 transition-colors">
            Products
          </Link>
          {user && (
            <>
              <Link to="/my-orders" className="hover:text-amber-600 transition-colors">
                My Orders
              </Link>
              <Link to="/my-products" className="hover:text-amber-600 transition-colors">
                My Products
              </Link>
              <Link to="/my-sales" className="hover:text-amber-600 transition-colors">
                My Sales
              </Link>
              <Link to="/notifications" className="relative hover:text-amber-600 transition-colors">
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              {(user.role == ("GoldShop") ) && (
                <Link to="/goldshop/dashboard" className="hover:text-amber-600 transition-colors font-bold text-amber-500">
                  Shop Dashboard
                </Link>
              )}
              {user.role === "Admin" && (
                <Link to="/admin" className="hover:text-amber-600 transition-colors">
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-amber-600 font-medium"
              >
                <span className="text-base">🏅</span>
                {user.fullName || "User"}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-amber-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 h-0.5 bg-gray-600 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-4 py-4 space-y-3 text-sm font-medium">
          <Link to="/products" className="block text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          {user && (
            <>
              <Link to="/my-orders" className="block text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              <Link to="/my-products" className="block text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                My Products
              </Link>
              <Link to="/my-sales" className="block text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                My Sales
              </Link>
              <Link to="/notifications" className="block text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </Link>
              {(user.role === "GoldShop" || user.role === "Admin") && (
                <Link to="/goldshop/dashboard" className="block font-bold text-amber-500 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                  Shop Dashboard
                </Link>
              )}
              {user.role === "Admin" && (
                <Link to="/admin" className="block text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-1.5 text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                <span>🏅</span> Profile
              </Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-600">
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="block text-gray-700 hover:text-amber-600" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block text-amber-600 font-semibold" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
