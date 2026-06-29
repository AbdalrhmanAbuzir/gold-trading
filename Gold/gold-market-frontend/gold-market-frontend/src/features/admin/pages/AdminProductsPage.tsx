import { useEffect, useState } from "react";
import { productService } from "../../../services/productService";
import { FaBox, FaTags, FaBalanceScale, FaGem, FaInfoCircle } from "react-icons/fa";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";
import ProductStatusBadge from "../../../components/common/ProductStatusBadge";
import { formatCurrency } from "../../../utils/formatters";
import { mapProduct } from "../../../store/slices/productSlice";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      // Handle array structure wrapping if any
      const items = data.items ?? data;
      setProducts(Array.isArray(items) ? items.map(mapProduct) : []);
    } catch (err: any) {
      setError("Failed to load platform products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-2">
          <FaBox /> Marketplace Products
        </h1>
        <button
          onClick={loadProducts}
          className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm rounded-lg transition-colors"
        >
          Refresh Products
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {products.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl text-center py-20 text-gray-500 shadow-xl">
          <FaBox className="mx-auto text-5xl mb-4 text-slate-800" />
          <p className="text-sm">No active gold products are currently listed on the marketplace.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-0.5 bg-slate-900 text-amber-500 border border-slate-850 rounded text-xxs font-mono">
                    ID: {product.id?.substring(0, 8)}…
                  </span>
                  <ProductStatusBadge status={product.status} />
                </div>

                {/* Product Image display */}
                <div className="relative h-44 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-850 mb-4 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-800">🏅</div>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-200 mb-2 group-hover:text-amber-500 transition-colors">{product.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4">{product.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-900/50 border border-slate-850 rounded-xl p-2.5 flex items-center gap-2">
                    <FaBalanceScale className="text-amber-500 text-xs" />
                    <div>
                      <span className="text-[10px] text-gray-500 block">Weight</span>
                      <span className="text-xs font-semibold text-gray-300">{product.weight}g</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-850 rounded-xl p-2.5 flex items-center gap-2">
                    <FaGem className="text-amber-500 text-xs" />
                    <div>
                      <span className="text-[10px] text-gray-500 block">Karat</span>
                      <span className="text-xs font-semibold text-gray-300">{product.karat}K</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FaTags className="text-gray-500 text-xs" />
                    <span className="text-xxs text-gray-400 font-medium">Category: {product.categoryName || "Gold"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Current Price</span>
                    <span className="text-sm font-bold text-amber-500">{formatCurrency(product.price)} JD</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 mt-5 pt-3 flex items-center gap-2 text-xxs text-gray-500">
                <FaInfoCircle />
                <span>Seller: <span className="font-semibold text-gray-400">{product.sellerName}</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
