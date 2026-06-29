import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../store/slices/authSlice";
import {
  FaChartBar,
  FaClipboardList,
  FaHourglassHalf,
  FaCheckCircle,
  FaChartLine,
  FaSignOutAlt,
  FaHome,
  FaStore
} from "react-icons/fa";

const navItems = [
  { to: "/goldshop/dashboard", label: "Dashboard", icon: <FaChartBar /> },
  { to: "/goldshop/orders", label: "All Orders", icon: <FaClipboardList /> },
  { to: "/goldshop/orders/reserved", label: "Reserved", icon: <FaHourglassHalf /> },
  { to: "/goldshop/orders/completed", label: "Completed", icon: <FaCheckCircle /> },
  { to: "/goldshop/analytics", label: "Analytics", icon: <FaChartLine /> },
];

export default function GoldShopSidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
          <FaStore className="text-3xl text-amber-500" />
          <div>
            <h1 className="text-xl font-bold text-amber-500 leading-tight">GoldMarket</h1>
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Shop Portal</p>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/goldshop/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-slate-800 hover:text-red-400 transition-all"
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white rounded-xl text-xs font-semibold transition-all"
        >
          <FaHome /> Back to Main Site
        </Link>
      </div>
    </aside>
  );
}
