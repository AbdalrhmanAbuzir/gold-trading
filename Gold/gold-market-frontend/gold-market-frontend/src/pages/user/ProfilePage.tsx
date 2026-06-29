import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchProfile } from "../../store/slices/profileSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatDate } from "../../utils/formatters";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((s) => s.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-32" />
        <div className="px-8 pb-8">
          <div className="flex items-end gap-4 -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
              <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                profile.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {profile.isApproved ? "Approved" : "Pending Approval"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-800">{profile.email}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="font-medium text-gray-800">{profile.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Role</p>
              <p className="font-medium text-gray-800">{profile.roles?.join(", ") || "User"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Member Since</p>
              <p className="font-medium text-gray-800">{profile.createdAt ? formatDate(profile.createdAt) : "—"}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/profile/edit"
              className="px-6 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors text-sm"
            >
              Edit Profile
            </Link>
            <Link
              to="/my-orders"
              className="px-6 py-2.5 border border-amber-300 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors text-sm"
            >
              My Orders
            </Link>
            <Link
              to="/my-products"
              className="px-6 py-2.5 border border-amber-300 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors text-sm"
            >
              My Products
            </Link>
            <Link
              to="/my-sales"
              className="px-6 py-2.5 border border-amber-300 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors text-sm"
            >
              My Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
