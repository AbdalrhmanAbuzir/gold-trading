import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchDashboard, fetchCompletedOrders } from "../../store/slices/goldShopSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { FaChartLine, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const { dashboard, completedOrders, loading, error } = useAppSelector((s) => s.goldShop);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchCompletedOrders());
  }, [dispatch]);

  if (loading && !dashboard) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const completionRate = dashboard
    ? dashboard.totalOrders > 0
      ? Math.round((dashboard.completedOrders / dashboard.totalOrders) * 100)
      : 0
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FaChartLine className="text-2xl text-amber-500" />
        <div>
          <h1 className="text-3xl font-bold text-amber-500">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Revenue & performance overview</p>
        </div>
      </div>

      {dashboard && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <FaMoneyBillWave className="absolute right-4 bottom-4 text-6xl opacity-20" />
              <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold">{formatCurrency(dashboard.totalRevenue)}</p>
            </div>
            
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl p-6 relative overflow-hidden">
              <FaCheckCircle className="absolute right-4 bottom-4 text-6xl text-green-500/10" />
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">Completion Rate</p>
              <p className="text-4xl font-bold text-green-500">{completionRate}%</p>
              <div className="mt-3 bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">Avg. Order Value</p>
              <p className="text-4xl font-bold text-amber-500">
                {dashboard.completedOrders > 0
                  ? formatCurrency(dashboard.totalRevenue / dashboard.completedOrders)
                  : "—"}
              </p>
            </div>
          </div>

          {/* Order breakdown */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl p-6">
            <h2 className="font-bold text-white text-lg mb-5">Order Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: "Completed", count: dashboard.completedOrders, color: "from-green-600 to-green-400", total: dashboard.totalOrders },
                { label: "Reserved", count: dashboard.reservedOrders, color: "from-amber-600 to-amber-400", total: dashboard.totalOrders },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-5">
                  <p className="text-sm font-medium text-gray-400 w-24">{item.label}</p>
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: item.total > 0 ? `${(item.count / item.total) * 100}%` : "0%" }}
                    />
                  </div>
                  <p className="text-sm font-bold text-white w-8 text-right">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Completed orders table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-bold text-white text-lg">Completed Orders</h2>
        </div>
        
        {completedOrders.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">No completed orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-900/50 text-gray-400 uppercase tracking-wider text-xs border-b border-slate-800">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Buyer</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {completedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-200">{order.productTitle}</td>
                    <td className="px-6 py-4 text-gray-400">{order.buyerName}</td>
                    <td className="px-6 py-4 text-amber-500 font-bold">{formatCurrency(order.lockedPrice)} JD</td>
                    <td className="px-6 py-4 text-gray-500">{order.completedAt ? formatDate(order.completedAt) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
