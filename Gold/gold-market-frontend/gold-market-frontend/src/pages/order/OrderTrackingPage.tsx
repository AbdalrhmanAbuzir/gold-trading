import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchOrderById } from "../../store/slices/orderSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency, formatDateTime, timeRemaining } from "../../utils/formatters";
import type { OrderStatus } from "../../types";

const steps: { status: OrderStatus | "Created"; label: string; icon: string }[] = [
  { status: "Created", label: "Order Created", icon: "📝" },
  { status: "Reserved", label: "Reserved (48h)", icon: "⏳" },
  { status: "Completed", label: "Completed", icon: "✅" },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedOrder: order, loading, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  const activeStep =
    order.status === "Completed" ? 2 :
    order.status === "Reserved" ? 1 : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-amber-600 hover:underline text-sm mb-6">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Tracking</h1>
      <p className="text-sm text-gray-500 mb-8">Order ID: {order.id}</p>

      {/* Timeline */}
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200" />
          <div
            className="absolute top-6 left-8 h-0.5 bg-amber-500 transition-all"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, i) => (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-4 ${
                  i <= activeStep
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <p className={`text-xs mt-2 font-medium text-center ${i <= activeStep ? "text-amber-700" : "text-gray-400"}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Product</p>
            <p className="font-medium text-gray-800">{order.productTitle}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Locked Price</p>
            <p className="font-bold text-amber-600 text-lg">{formatCurrency(order.lockedPrice)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Gold Shop</p>
            <p className="font-medium text-gray-800">{order.goldShopName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Created</p>
            <p className="font-medium text-gray-800">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        {order.status === "Reserved" && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-700">
            <p className="font-semibold mb-1">⏱️ Time Remaining</p>
            <p>{timeRemaining(order.expiresAt)}</p>
            <p className="mt-1 text-orange-600">Visit <strong>{order.goldShopName}</strong> before the order expires.</p>
          </div>
        )}

        {order.status === "Completed" && order.receiptImageUrl && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Receipt</p>
            <img src={order.receiptImageUrl} alt="Receipt" className="rounded-xl max-h-64 object-contain border" />
          </div>
        )}

        {(order.status === "Expired" || order.status === "Cancelled") && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Order {order.status.toLowerCase()}. Please create a new order if needed.
          </div>
        )}
      </div>
    </div>
  );
}
