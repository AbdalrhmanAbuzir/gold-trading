import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <span className="text-3xl">🏅</span>
        <span className="text-2xl font-bold text-amber-400">GoldMarket</span>
      </Link>
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        {children}
      </div>
    </div>
  );
}