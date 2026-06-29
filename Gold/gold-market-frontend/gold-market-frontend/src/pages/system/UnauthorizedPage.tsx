import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <div className="text-7xl mb-6">🚫</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          You don't have permission to view this page. This area may require a different role
          or account approval.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/profile"
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
