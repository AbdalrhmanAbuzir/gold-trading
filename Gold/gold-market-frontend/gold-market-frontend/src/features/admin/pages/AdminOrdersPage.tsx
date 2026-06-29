import { useEffect, useState } from "react";
import { FaClipboardList, FaSearch, FaStore, FaEye } from "react-icons/fa";
import OrderStatusBadge from "../../../components/common/OrderStatusBadge";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import type { OrderStatus } from "../../../types";
import { adminService } from "../adminService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.response?.data || "Failed to load platform orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.goldShopName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filter === "all" ? true : o.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-2">
          <FaClipboardList /> Platform Orders
        </h1>
        <div className="text-xs text-gray-400">
          Showing {filteredOrders.length} orders
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          {["all", "reserved", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all uppercase tracking-wider ${
                filter === tab ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by product, buyer, shop…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-500"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500 text-xs" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : error ? (
          <div className="p-6"><ErrorMessage message={error} /></div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-gray-400 uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-4 font-semibold">Order ID / Date</th>
                <th className="px-6 py-4 font-semibold">Product Detail</th>
                <th className="px-6 py-4 font-semibold">Buyer / Seller</th>
                <th className="px-6 py-4 font-semibold">Gold Shop</th>
                <th className="px-6 py-4 font-semibold">Locked Price</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-200 font-mono">{o.id}</div>
                    <div className="text-gray-500 text-xxs mt-0.5">{formatDateTime(o.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-300">{o.productTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">Buyer: <span className="font-semibold text-gray-400">{o.buyerName}</span></div>
                    <div className="text-gray-500 text-xxs mt-0.5">Seller: {o.sellerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300 flex items-center gap-1.5">
                      <FaStore className="text-amber-500" />
                      <span>{o.goldShopName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-amber-500">
                    {formatCurrency(o.lockedPrice)} JD
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <OrderStatusBadge status={o.status as OrderStatus} />
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-black border border-slate-800 rounded-lg text-gray-400 transition-colors"
                        title="View details"
                      >
                        <FaEye className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-12">
                    No orders matched the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs transition-colors"
            >
              Close
            </button>
            <h3 className="text-lg font-bold text-amber-500 mb-1">Reservation Transaction</h3>
            <p className="text-[10px] text-gray-500 font-mono mb-4">Order ID: {selectedOrder.id}</p>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                <span className="text-[10px] text-gray-500 block">Gold Product</span>
                <span className="font-semibold text-gray-200 text-sm mt-0.5 block">{selectedOrder.productTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Buyer (Reserved By)</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{selectedOrder.buyerName}</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Seller (Listed By)</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{selectedOrder.sellerName}</span>
                </div>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                <span className="text-[10px] text-gray-500 block">Assigned Verification Shop</span>
                <div className="flex items-center gap-1.5 mt-1 font-semibold text-amber-500">
                  <FaStore className="text-xs" />
                  <span>{selectedOrder.goldShopName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Verification Status</span>
                  <span className="font-semibold text-amber-500 mt-0.5 block">{selectedOrder.status}</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Reserved Date</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{formatDateTime(selectedOrder.createdAt)}</span>
                </div>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-500 block">Completed Date</span>
                  <span className="font-semibold text-gray-200 block">
                    {selectedOrder.completedAt ? formatDateTime(selectedOrder.completedAt) : "Awaiting shop verification"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">Locked Price</span>
                  <span className="text-base font-extrabold text-amber-500">{selectedOrder.lockedPrice} JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
