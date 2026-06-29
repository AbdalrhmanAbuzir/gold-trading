import { Outlet } from "react-router-dom";
import GoldShopSidebar from "../components/goldshop/GoldShopSidebar";

export default function GoldShopLayout() {
  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      <GoldShopSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
