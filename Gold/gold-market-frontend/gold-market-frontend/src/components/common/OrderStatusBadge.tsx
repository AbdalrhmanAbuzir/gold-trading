import type { OrderStatus } from "../../types";

const styles: Record<OrderStatus, string> = {
  Reserved: "bg-amber-100 text-amber-800 border-amber-300",
  Completed: "bg-green-100 text-green-800 border-green-300",
  Expired: "bg-gray-100 text-gray-600 border-gray-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${styles[status]}`}
    >
      {status}
    </span>
  );
}
