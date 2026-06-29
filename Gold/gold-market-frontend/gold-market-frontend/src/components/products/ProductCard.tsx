import { Link } from "react-router-dom";
import type { Product } from "../../types";
import ProductStatusBadge from "../common/ProductStatusBadge";
import { formatCurrency } from "../../utils/formatters";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative h-48 bg-amber-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🏅</div>
        )}
        <div className="absolute top-3 right-3">
          <ProductStatusBadge status={product.status} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>⚖️ {product.weight}g</span>
          <span>✨ {product.karat}K</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-amber-600 font-bold text-lg">
            {formatCurrency(product.price)}
          </span>
          <Link
            to={`/products/${product.id}`}
            className="text-sm px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
