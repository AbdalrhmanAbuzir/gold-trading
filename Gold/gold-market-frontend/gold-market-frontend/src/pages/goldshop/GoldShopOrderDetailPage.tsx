import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchGoldShopOrderById } from "../../store/slices/goldShopSlice";
import { completeOrder } from "../../store/slices/orderSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { formatCurrency, formatDateTime, timeRemaining } from "../../utils/formatters";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function GoldShopOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedOrder: order, loading, error } = useAppSelector((s) => s.goldShop);
  const { loading: orderLoading } = useAppSelector((s) => s.orders);

  const [receipt, setReceipt] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchGoldShopOrderById(id));
  }, [dispatch, id]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!receipt) {
      alert("Receipt image is required to complete the order.");
      return;
    }
    setCompleting(true);
    const res = await dispatch(completeOrder({ data: { orderId: order.id, notes }, receiptFile: receipt }));
    setCompleting(false);
    if (completeOrder.fulfilled.match(res)) {
      dispatch(fetchGoldShopOrderById(order.id));
    }
  };

  if (loading && !order) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm mb-6 transition-colors font-medium">
        <FaArrowLeft /> Back to Orders
      </button>

      <div className="flex items-start justify-between mb-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white">{order.productTitle}</h1>
          <p className="text-sm text-gray-400 mt-2 font-mono">Order ID: {order.id}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Order info */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl p-6 mb-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-300"></div>
        
        <div>
          <h2 className="font-bold text-white text-lg mb-4">Parties Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/50">
              <p className="text-xs text-amber-500 mb-2 uppercase tracking-wider font-semibold">Buyer Details</p>
              <p className="font-semibold text-gray-200 text-lg">{order.buyerName}</p>
              <p className="text-sm text-gray-400 mt-1">Phone: {order.buyerPhone || "—"}</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/50">
              <p className="text-xs text-amber-500 mb-2 uppercase tracking-wider font-semibold">Seller Details</p>
              <p className="font-semibold text-gray-200 text-lg">{order.sellerName || "—"}</p>
              <p className="text-sm text-gray-400 mt-1">Phone: {order.sellerPhone || "—"}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white text-lg mb-4">Transaction Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoBlock label="Locked Price" value={`${formatCurrency(order.lockedPrice)} JD`} highlight />
            <InfoBlock label="Reserved At" value={formatDateTime(order.createdAt)} />
            {order.status === "Reserved" && order.reservedUntil && (
              <InfoBlock label="Expires At" value={formatDateTime(order.reservedUntil)} />
            )}
            {order.status === "Reserved" && !order.reservedUntil && order.expiresAt && (
              <InfoBlock label="Expires At" value={timeRemaining(order.expiresAt)} />
            )}
            {order.completedAt && (
              <InfoBlock label="Completed At" value={formatDateTime(order.completedAt)} />
            )}
          </div>
        </div>

        {order.notes && (
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Notes</p>
            <p className="text-sm text-gray-300 italic">"{order.notes}"</p>
          </div>
        )}

        {order.receiptImageUrl && (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Receipt</p>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 inline-block">
              <img src={order.receiptImageUrl} alt="Receipt" className="rounded-lg max-h-80 object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* Complete order form */}
      {order.status === "Reserved" && (
        <div className="bg-slate-950 rounded-2xl border border-amber-500/30 shadow-xl p-6 shadow-amber-500/5">
          <h2 className="font-bold text-amber-500 text-lg mb-5 flex items-center gap-2">
            <FaCheckCircle /> Complete This Order
          </h2>
          <form onSubmit={handleComplete} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Receipt Image <span className="text-red-500 font-normal">(Required)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                required
                className="text-sm text-gray-400 w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-amber-500 hover:file:bg-slate-700 transition-colors"
                onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-white placeholder-gray-600 transition-all"
                placeholder="Add any notes about the transaction…"
              />
            </div>
            <button
              type="submit"
              disabled={completing || orderLoading}
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-base hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-500/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              <FaCheckCircle /> {completing ? "Completing…" : "Mark as Completed"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800/50">
      <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">{label}</p>
      <p className={`font-semibold ${highlight ? "text-amber-500 text-xl" : "text-gray-200 text-lg"}`}>{value}</p>
    </div>
  );
}
