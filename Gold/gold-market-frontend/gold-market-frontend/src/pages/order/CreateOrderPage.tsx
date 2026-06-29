import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchProductById } from "../../store/slices/productSlice";
import { createOrder } from "../../store/slices/orderSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatCurrency } from "../../utils/formatters";
import { api } from "../../app/api/axios";

interface GoldShop {
  id: string;
  name: string;
  address: string;
}

export default function CreateOrderPage() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, loading: productLoading } = useAppSelector((s) => s.products);
  const { loading: orderLoading, error } = useAppSelector((s) => s.orders);
  const { user } = useAppSelector((s) => s.auth);

  const [selectedShop, setSelectedShop] = useState("");

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const shops = product?.goldShops || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !selectedShop) return;
    const res = await dispatch(createOrder({ productId, goldShopId: selectedShop }));
    if (createOrder.fulfilled.match(res)) {
      navigate(`/order/success/${res.payload}`);
    }
  };

  const isOwner = user?.id === product?.sellerId;

  if (productLoading) return <LoadingSpinner />;
  if (!product) return <ErrorMessage message="Product not found" />;
  if (isOwner) return <ErrorMessage message="You cannot reserve your own product" />;

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="text-amber-600 hover:underline text-sm mb-6">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Place Order</h1>

      {/* Product summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.title} />
            ) : (
              <span className="text-3xl">🏅</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">{product.title}</h2>
            <p className="text-sm text-gray-500">{product.weight}g · {product.karat}K</p>
            <p className="text-amber-600 font-bold text-xl mt-1">{formatCurrency(product.price)}</p>
          </div>
        </div>
        <div className="mt-4 bg-amber-50 rounded-xl p-3 text-sm text-amber-800">
          ⏱️ Price will be locked for <strong>48 hours</strong> after order creation.
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Gold Shop</label>
          {shops.length === 0 ? (
            <p className="text-sm text-gray-500">No gold shops available.</p>
          ) : (
            <div className="space-y-2">
              {shops.map((shop) => (
                <label
                  key={shop.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    selectedShop === shop.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="goldShop"
                    value={shop.id}
                    checked={selectedShop === shop.id}
                    onChange={() => setSelectedShop(shop.id)}
                    className="mt-1 accent-amber-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{shop.name}</p>
                    <p className="text-sm text-gray-500">{shop.address}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedShop || orderLoading}
          className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-60 transition-colors"
        >
          {orderLoading ? "Creating Order…" : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}
