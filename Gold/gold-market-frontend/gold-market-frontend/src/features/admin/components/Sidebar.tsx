import {
  FaUsers,
  FaChartBar,
  FaStore,
  FaBox,
  FaClipboardList,
  FaHome
} from "react-icons/fa";

import { NavLink, Link } from "react-router-dom";

const links = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <FaChartBar />
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <FaUsers />
  },
  {
    label: "Gold Shops",
    path: "/admin/goldshops",
    icon: <FaStore />
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: <FaBox />
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: <FaClipboardList />
  }
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-[#D4AF37]">
            Gold Market
          </h1>
        </div>

        <div className="p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-4 py-3 rounded-xl
                transition-all
                ${
                  isActive
                    ? "bg-[#D4AF37] text-black"
                    : "hover:bg-slate-800"
                }
              `
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-850">
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