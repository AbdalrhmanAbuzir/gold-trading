import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { login } from "../../store/slices/authSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));
    if (login.fulfilled.match(res)) {
      const user = (res.payload as string)
        ? JSON.parse(atob((res.payload as string).split(".")[1]))
        : null;
      const role =
        user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        user?.role;
      if (role === "GoldShop") navigate("/goldshop/dashboard");
      else if (role === "Admin") navigate("/admin");
      else navigate("/");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-white text-center mb-6">Sign in to GoldMarket</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        No account?{" "}
        <Link to="/register" className="text-amber-400 hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}
