import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  fetchGoldShopOrders,
  fetchReservedOrders,
  fetchCompletedOrders,
} from "../../store/slices/goldShopSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import type { Order } from "../../types";
import { FaClipboardList } from "react-icons/fa";

interface Props {
  filter: "all" | "reserved" | "completed";
}

function OrderRow({ order }: { order: Order }) {
  return (
    <Link
      to={`/goldshop/orders/${order.id}`}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-900 transition-colors border border-slate-800 group"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-200 text-sm truncate group-hover:text-amber-400 transition-colors">{order.productTitle}</p>
        <p className="text-xs text-gray-500 mt-1">{order.buyerName} &bull; {formatDateTime(order.createdAt)}</p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <span className="text-amber-500 font-bold text-sm">{formatCurrency(order.lockedPrice)} JD</span>
        <OrderStatusBadge status={order.status} />
      </div>
    </Link>
  );
}

export default function OrdersListPage({ filter }: Props) {
  const dispatch = useAppDispatch();
  const { orders, reservedOrders, completedOrders, loading, error } = useAppSelector((s) => s.goldShop);

  useEffect(() => {
    if (filter === "all") dispatch(fetchGoldShopOrders());
    else if (filter === "reserved") dispatch(fetchReservedOrders());
    else dispatch(fetchCompletedOrders());
  }, [dispatch, filter]);

  const list = filter === "all" ? orders : filter === "reserved" ? reservedOrders : completedOrders;

  const titles = { all: "All Orders", reserved: "Reserved Orders", completed: "Completed Orders" };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaClipboardList className="text-2xl text-amber-500" />
        <h1 className="text-3xl font-bold text-amber-500">{titles[filter]}</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : list.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl">
          <FaClipboardList className="mx-auto text-5xl mb-4 text-slate-800" />
          <p className="text-sm">No orders found.</p>
        </div>
      ) : (
        <div className="bg-slate-950 rounded-2xl shadow-xl border border-slate-800 p-4 space-y-2">
          {list.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
