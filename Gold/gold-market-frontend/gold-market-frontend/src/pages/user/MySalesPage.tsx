import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchMySales } from "../../store/slices/profileSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

export default function MySalesPage() {
  const dispatch = useAppDispatch();
  const { mySales = [], loading, error } = useAppSelector((s) => s.profile);

  useEffect(() => {
    dispatch(fetchMySales());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Sales</h1>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : mySales.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="mb-4">You have no sales yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mySales.map((sale: any) => {
            return (
              <div key={sale.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{sale.productTitle}</h3>
                    <p className="text-sm text-gray-500">Buyer: {sale.buyerName}</p>
                  </div>
                  <OrderStatusBadge status={sale.status} />
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <span className="text-amber-600 font-semibold">{formatCurrency(sale.lockedPrice)} JD</span>
                  <span>Reserved: {formatDateTime(sale.reservedAt)}</span>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/orders/${sale.id}`}
                    className="text-sm px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
