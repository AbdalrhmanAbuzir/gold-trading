import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchDashboard } from "../../store/slices/goldShopSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${color}`}></div>
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className={`text-2xl ${color.replace('bg-', 'text-').replace('-500', '-400')}`}>{icon}</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-gray-300 border border-slate-800 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white relative z-10">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { dashboard, loading, error } = useAppSelector((s) => s.goldShop);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading && !dashboard) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboard) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-amber-500">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Gold Shop operational overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Orders" value={dashboard.totalOrders} icon={<FaClipboardList />} color="bg-blue-500" />
        <StatCard label="Reserved" value={dashboard.reservedOrders} icon={<FaHourglassHalf />} color="bg-amber-500" />
        <StatCard label="Completed" value={dashboard.completedOrders} icon={<FaCheckCircle />} color="bg-green-500" />
        <StatCard label="Revenue" value={formatCurrency(dashboard.totalRevenue)} icon={<FaMoneyBillWave />} color="bg-purple-500" />
      </div>

      {/* Latest orders */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-300"></div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-lg">Latest Orders</h2>
          <Link to="/goldshop/orders" className="text-amber-500 text-sm font-semibold hover:text-amber-400 hover:underline">
            View all &rarr;
          </Link>
        </div>

        {dashboard.latestOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800/50">
            <FaClipboardList className="mx-auto text-4xl mb-3 text-slate-700" />
            <p className="text-sm text-gray-500">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.latestOrders.map((order) => (
              <Link
                key={order.id}
                to={`/goldshop/orders/${order.id}`}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-900 transition-colors border border-slate-800 group"
              >
                <div>
                  <p className="font-semibold text-gray-200 text-sm group-hover:text-amber-400 transition-colors">{order.productTitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.buyerName} &bull; {formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-amber-500 font-bold text-sm">{formatCurrency(order.lockedPrice)} JD</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
