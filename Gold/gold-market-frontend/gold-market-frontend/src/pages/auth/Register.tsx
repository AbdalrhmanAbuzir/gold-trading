import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { register } from "../../store/slices/authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [identityImage, setIdentityImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (profileImage) formData.append("profileImage", profileImage);
    if (identityImage) formData.append("identityImage", identityImage);
    if (faceImage) formData.append("faceImage", faceImage);
    formData.append("acceptedTerms", String(acceptedTerms));

    const res = await dispatch(register(formData));
    if (register.fulfilled.match(res)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-6">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Registration Submitted!</h2>
          <p className="text-gray-400 text-sm">
            Your account is pending approval. You'll be redirected to login…
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Full Name</label>
          <input className="input" placeholder="John Doe" required value={form.fullName} onChange={set("fullName")} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input type="email" className="input" placeholder="you@example.com" required value={form.email} onChange={set("email")} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone</label>
          <input className="input" placeholder="+962 7xx xxx xxx" required value={form.phone} onChange={set("phone")} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input type="password" className="input" placeholder="••••••••" required value={form.password} onChange={set("password")} />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Profile Image</label>
          <input type="file" accept="image/*" required className="text-gray-300 text-sm w-full" onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Identity Image</label>
          <input type="file" accept="image/*" required className="text-gray-300 text-sm w-full" onChange={(e) => setIdentityImage(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Face Image</label>
          <input type="file" accept="image/*" required className="text-gray-300 text-sm w-full" onChange={(e) => setFaceImage(e.target.files?.[0] ?? null)} />
        </div>

        <div className="flex items-center gap-2 py-2">
          <input
            id="acceptedTerms"
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
          />
          <label htmlFor="acceptedTerms" className="text-sm text-gray-400 cursor-pointer select-none">
            I accept the <span className="text-amber-400 hover:underline">terms and conditions</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
        >
          {loading ? "Registering…" : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-amber-400 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
