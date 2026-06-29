import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  return (
    <div className="h-screen flex bg-slate-900 text-white">

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">

        <Header />

        <main className="flex-1 overflow-auto p-6 bg-slate-950">
          <Outlet />
        </main>

      </div>

    </div>
  );
}