import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchMyOrders } from "../../store/slices/profileSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { formatCurrency, formatDateTime, timeRemaining } from "../../utils/formatters";

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const { myOrders, loading, error } = useAppSelector((s) => s.profile);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : myOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p className="mb-4">You have no orders yet.</p>
          <Link to="/products" className="text-amber-600 hover:underline font-medium">
            Browse Products →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => {
            const orderDate = order.createdAt || order.reservedAt;
            const reservedAtStr = order.reservedAt;
            let expiryDate = undefined;
            if (reservedAtStr) {
              const hasTimezone = reservedAtStr.endsWith("Z") || reservedAtStr.includes("+") || (reservedAtStr.includes("-") && reservedAtStr.indexOf("-") !== reservedAtStr.lastIndexOf("-"));
              const utcReservedAtStr = hasTimezone ? reservedAtStr : `${reservedAtStr}Z`;
              expiryDate = new Date(new Date(utcReservedAtStr).getTime() + 48 * 3600 * 1000).toISOString();
            }

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.productTitle}</h3>
                    <p className="text-sm text-gray-500">{order.goldShopName}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <span className="text-amber-600 font-semibold">{formatCurrency(order.lockedPrice)}</span>
                  <span>{formatDateTime(orderDate || "")}</span>
                  {order.status === "Reserved" && expiryDate && (
                    <span className="text-orange-600 font-medium">{timeRemaining(expiryDate || "")}</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    View Details
                  </Link>
                  {order.status === "Reserved" && (
                    <Link
                      to={`/order-tracking/${order.id}`}
                      className="text-sm px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Track Order
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
