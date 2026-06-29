import { useParams, Link } from "react-router-dom";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Your order has been reserved. The price is locked for <strong>48 hours</strong>.
          Visit the gold shop to complete your transaction.
        </p>

        <div className="bg-amber-50 rounded-xl p-4 mb-8 text-sm">
          <p className="text-amber-700 font-medium">Order ID</p>
          <p className="text-amber-900 font-mono mt-1">{id}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to={`/orders/${id}`}
            className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
          >
            View Order Details
          </Link>
          <Link
            to={`/order-tracking/${id}`}
            className="w-full py-3 border border-amber-300 text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
          >
            Track Order
          </Link>
          <Link
            to="/products"
            className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
