import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchOrderById, cancelOrder } from "../../store/slices/orderSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { formatCurrency, formatDateTime, timeRemaining } from "../../utils/formatters";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedOrder: order, loading, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm("Cancel this order? This cannot be undone.")) return;
    await dispatch(cancelOrder(order.id));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-amber-600 hover:underline text-sm mb-6">
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{order.productTitle}</h1>
            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoBlock label="Locked Price" value={formatCurrency(order.lockedPrice)} highlight />
          <InfoBlock label="Gold Shop" value={order.goldShopName} />
          <InfoBlock label="Created" value={formatDateTime(order.createdAt)} />
          {order.status === "Reserved" && (
            <InfoBlock label="Expires" value={timeRemaining(order.expiresAt)} />
          )}
          {order.completedAt && (
            <InfoBlock label="Completed" value={formatDateTime(order.completedAt)} />
          )}
        </div>

        {/* Parties Information */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-bold text-gray-900 text-base mb-4">Parties Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-amber-600 mb-2 uppercase tracking-wider font-semibold">Buyer Details</p>
              <p className="font-semibold text-gray-800 text-sm">{order.buyerName || "—"}</p>
              <p className="text-xs text-gray-500 mt-1">Phone: {order.buyerPhone || "—"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-amber-600 mb-2 uppercase tracking-wider font-semibold">Seller Details</p>
              <p className="font-semibold text-gray-800 text-sm">{order.sellerName || "—"}</p>
              <p className="text-xs text-gray-500 mt-1">Phone: {order.sellerPhone || "—"}</p>
            </div>
          </div>
        </div>

        {order.receiptImageUrl && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Receipt</p>
            <img src={order.receiptImageUrl} alt="Receipt" className="rounded-xl max-h-64 object-contain border" />
          </div>
        )}

        {order.notes && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}

        {order.status === "Reserved" && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`font-semibold ${highlight ? "text-amber-600 text-xl" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
