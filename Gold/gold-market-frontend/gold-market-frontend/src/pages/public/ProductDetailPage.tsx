import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchProductById } from "../../store/slices/productSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import ProductStatusBadge from "../../components/common/ProductStatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading, error } = useAppSelector((s) => s.products);
  const { user } = useAppSelector((s) => s.auth);

  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.imageUrl) {
      setActiveImage(product.imageUrl);
    }
  }, [product]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const isOwner = user?.id === product.sellerId;
  const canOrder = user?.isApproved && product.status === "Available" && !isOwner;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-amber-600 hover:underline text-sm mb-6 flex items-center gap-1">
        ← Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="flex flex-col bg-slate-50 border-r border-gray-100">
            <div className="h-72 md:h-[400px] flex items-center justify-center overflow-hidden bg-slate-50">
              {activeImage ? (
                <img src={activeImage} alt={product.title} className="w-full h-full object-cover transition-all duration-300" />
              ) : (
                <span className="text-8xl">🏅</span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50 border-t border-gray-100/60 scrollbar-thin">
                {product.images.map((img: any) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(img.imageUrl)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === img.imageUrl
                        ? "border-amber-500 scale-95 shadow-sm"
                        : "border-transparent hover:border-amber-300"
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              <ProductStatusBadge status={product.status} />
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Weight</p>
                <p className="text-xl font-bold text-amber-700">{product.weight}g</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Karat</p>
                <p className="text-xl font-bold text-amber-700">{product.karat}K</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="text-3xl font-bold text-amber-600">{formatCurrency(product.price)}</p>
              <p className="text-xs text-gray-400 mt-1">Price locked at order creation</p>
            </div>

            <div className="text-sm text-gray-500 mb-6 space-y-1">
              <p>Seller: <span className="font-medium text-gray-700">{product.sellerName}</span></p>
              <p>Listed: <span className="font-medium text-gray-700">{formatDate(product.createdAt)}</span></p>
            </div>

            {/* Price Breakdown Details */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-2 py-1.5 border-b border-gray-200/60 text-xs sm:text-sm">
                  <span className="text-gray-500 whitespace-nowrap">Pricing Method</span>
                  <span className="font-semibold text-gray-800 whitespace-nowrap">
                    {product.pricingType === 1 ? "Fixed Price" : "Market-Linked"}
                  </span>
                </div>

                {product.pricingType === 1 ? (
                  <div className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-1.5 leading-relaxed">
                    ℹ️ This product has a fixed price set by the seller and is not affected by gold market rate changes.
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center gap-2 py-1.5 border-b border-gray-200/60 text-xs sm:text-sm">
                      <span className="text-gray-500 whitespace-nowrap">Reference Rate</span>
                      <span className="font-medium text-gray-700 whitespace-nowrap">
                        {product.pricingType === 2 ? "Sell Price" : "Buy Price"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2 py-1.5 border-b border-gray-200/60 text-xs sm:text-sm">
                      <span className="text-gray-500 whitespace-nowrap">Gold Karat</span>
                      <span className="font-medium text-gray-700 whitespace-nowrap">{product.karat}K</span>
                    </div>

                    <div className="flex justify-between items-center gap-2 py-1.5 border-b border-gray-200/60 text-xs sm:text-sm">
                      <span className="text-gray-500 whitespace-nowrap">Weight</span>
                      <span className="font-medium text-gray-700 whitespace-nowrap">{product.weight}g</span>
                    </div>

                    {product.priceAdjustmentPerGram ? (
                      <div className="flex justify-between items-center gap-2 py-1.5 border-b border-gray-200/60 text-xs sm:text-sm">
                        <span className="text-gray-500 whitespace-nowrap">Adjustment Per Gram</span>
                        <span className="font-medium text-gray-700 whitespace-nowrap">
                          {product.priceAdjustmentPerGram > 0 ? "+" : ""}
                          {formatCurrency(product.priceAdjustmentPerGram)} JD/g
                        </span>
                      </div>
                    ) : null}

                    {product.manufacturingValue ? (
                      <div className="flex justify-between items-center gap-2 py-1.5 border-b border-gray-200/60 text-xs sm:text-sm">
                        <span className="text-gray-500 whitespace-nowrap">Manufacturing Fee</span>
                        <span className="font-medium text-gray-700 whitespace-nowrap">
                          {formatCurrency(product.manufacturingValue)} JD{" "}
                          {product.manufacturingType === 2 ? "per gram" : "fixed"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center gap-2 py-1.5 border-b border-gray-200/60 text-xs sm:text-sm">
                        <span className="text-gray-500 whitespace-nowrap">Manufacturing Fee</span>
                        <span className="font-medium text-emerald-600 whitespace-nowrap">No Fee</span>
                      </div>
                    )}

                    <div className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-1.5 leading-relaxed">
                      ℹ️ This price updates dynamically with the gold market. It gets locked for 48 hours only when you place the order.
                    </div>
                  </>
                )}
              </div>
            </div>

            {canOrder ? (
              <Link
                to={`/create-order/${product.id}`}
                className="mt-auto w-full py-3 bg-amber-500 text-white text-center rounded-xl font-semibold hover:bg-amber-600 transition-colors"
              >
                Place Order
              </Link>
            ) : !user ? (
              <Link
                to="/login"
                className="mt-auto w-full py-3 border-2 border-amber-500 text-amber-600 text-center rounded-xl font-semibold hover:bg-amber-50 transition-colors"
              >
                Login to Order
              </Link>
            ) : isOwner ? (
              <div className="mt-auto py-3 bg-amber-50 border border-amber-200 text-amber-800 text-center rounded-xl text-sm font-semibold">
                You own this listing
              </div>
            ) : (
              <div className="mt-auto py-3 bg-gray-100 text-gray-500 text-center rounded-xl text-sm font-medium">
                {product.status !== "Available" ? "Product Unavailable" : "Account Pending Approval"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
