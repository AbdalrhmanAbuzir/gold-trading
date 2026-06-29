import { Outlet } from "react-router-dom";

import Sidebar from "../features/admin/components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}