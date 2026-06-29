import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchMyProducts } from "../../store/slices/profileSlice";
import { createProduct, deleteProduct, clearError as clearProductError } from "../../store/slices/productSlice";
import { api } from "../../app/api/axios";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import ProductStatusBadge from "../../components/common/ProductStatusBadge";
import { formatCurrency } from "../../utils/formatters";

/* ── enums (frontend mirror) ── */
const pricingTypes = [
  { value: 1, label: "Fixed Price" },
  { value: 2, label: "Market Sell Price" },
  { value: 3, label: "Market Buy Price" },
];

const manufacturingTypes = [
  { value: 1, label: "Fixed Amount" },
  { value: 2, label: "Per Gram" },
];

export default function MyProductsPage() {
  const dispatch = useAppDispatch();
  const { myProducts, loading, error: profileError } = useAppSelector((s) => s.profile);
  const { loading: productLoading, error: productError } = useAppSelector((s) => s.products);
  const { user } = useAppSelector((s) => s.auth);

  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [goldShops, setGoldShops] = useState<any[]>([]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    weight: "",
    karat: "",
    categoryId: "",
    pricingType: 2,
    fixedPrice: "",
    priceAdjustmentPerGram: "",
    manufacturingType: 1,
    manufacturingValue: "",
    goldShopIds: [] as string[],
  });

  /* ── load categories + shops ── */
  useEffect(() => {
    api.get("/Category").then((r) => setCategories(r.data)).catch(() => {});
    api.get("/GoldShop")
      .then((r) => setGoldShops(r.data))
      .catch(() => {
        setGoldShops([
          { id: "11111111-1111-1111-1111-111111111111", name: "Al Amanah Gold Shop", address: "Amman - Downtown" },
          { id: "22222222-2222-2222-2222-222222222222", name: "Al Quds Gold Shop", address: "Amman - Jabal Amman" }
        ]);
      });
    dispatch(fetchMyProducts());
    dispatch(clearProductError());
  }, [dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearProductError());

    const fd = new FormData();

    fd.append("Title", form.title.trim());
    fd.append("Description", form.description.trim());
    fd.append("Weight", form.weight || "0");
    fd.append("Karat", form.karat || "0");
    fd.append("CategoryId", form.categoryId || "00000000-0000-0000-0000-000000000000");
    fd.append("PricingType", String(form.pricingType));
    fd.append("PriceAdjustmentPerGram", form.priceAdjustmentPerGram || "0");
    fd.append("ManufacturingType", String(form.manufacturingType));
    fd.append("ManufacturingValue", form.manufacturingValue || "0");
    fd.append("FixedPrice", form.fixedPrice || "0");

    form.goldShopIds.forEach((id) => fd.append("GoldShopIds", id));
    imageFiles.forEach((file) => fd.append("Images", file));

    const res = await dispatch(createProduct(fd));

    if (createProduct.fulfilled.match(res)) {
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        weight: "",
        karat: "",
        categoryId: "",
        pricingType: 2,
        fixedPrice: "",
        priceAdjustmentPerGram: "",
        manufacturingType: 1,
        manufacturingValue: "",
        goldShopIds: [],
      });
      setImageFiles([]);
      dispatch(fetchMyProducts());
    }
  };

  const toggleShop = (id: string) => {
    setForm((prev) => ({
      ...prev,
      goldShopIds: prev.goldShopIds.includes(id)
        ? prev.goldShopIds.filter((x) => x !== id)
        : [...prev.goldShopIds, id],
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this product?")) dispatch(deleteProduct(id));
  };

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>

        {user?.isApproved ? (
          <button
            onClick={() => {
              dispatch(clearProductError());
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        ) : (
          <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold select-none cursor-not-allowed">
            Verification Required to List Products
          </span>
        )}
      </div>

      {!user?.isApproved && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
          <span>⚠️</span>
          <span>Your account is currently pending verification. You will be able to list and purchase gold products once an administrator approves your verification request.</span>
        </div>
      )}

      {profileError && <ErrorMessage message={profileError} />}

      {/* ── FORM ── */}
      {showForm && (
        <div className="bg-white border rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-4">Create Product</h2>
          {productError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
              {productError}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              placeholder="Title"
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              type="number"
              placeholder="Weight (g)"
              className="input"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />

            <input
              type="number"
              placeholder="Karat"
              className="input"
              value={form.karat}
              onChange={(e) => setForm({ ...form, karat: e.target.value })}
            />

            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={form.pricingType}
              onChange={(e) => setForm({ ...form, pricingType: Number(e.target.value) })}
            >
              {pricingTypes.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            {form.pricingType === 1 && (
              <input
                type="number"
                placeholder="Fixed Price (JD)"
                className="input"
                value={form.fixedPrice}
                onChange={(e) => setForm({ ...form, fixedPrice: e.target.value })}
              />
            )}

            <input
              type="number"
              placeholder="Price Adjustment / Gram"
              className="input"
              value={form.priceAdjustmentPerGram}
              onChange={(e) => setForm({ ...form, priceAdjustmentPerGram: e.target.value })}
            />

            <select
              className="input"
              value={form.manufacturingType}
              onChange={(e) =>
                setForm({ ...form, manufacturingType: Number(e.target.value) })
              }
            >
              {manufacturingTypes.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Manufacturing Value"
              className="input"
              value={form.manufacturingValue}
              onChange={(e) => setForm({ ...form, manufacturingValue: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className="input sm:col-span-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* shops */}
            <div className="sm:col-span-2">
              <p className="text-sm mb-2 font-medium">Gold Shops</p>
              <div className="flex flex-wrap gap-2">
                {goldShops.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleShop(s.id)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      form.goldShopIds.includes(s.id)
                        ? "bg-amber-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* images */}
            <input
              type="file"
              multiple
              className="sm:col-span-2"
              onChange={(e) =>
                setImageFiles(Array.from(e.target.files || []))
              }
            />

            <button
              className="sm:col-span-2 bg-amber-500 text-white py-2 rounded-lg"
              disabled={productLoading}
            >
              {productLoading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      )}

      {/* ── LIST ── */}
      {loading ? (
        <LoadingSpinner />
      ) : myProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No products yet
        </p>
      ) : (
        <div className="space-y-4">
          {myProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                to={`/products/${p.id}`}
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-[10px] font-semibold">
                    No image
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.weight}g · {p.karat}K
                  </p>
                  <p className="text-amber-600 font-semibold text-xs mt-1">
                    {formatCurrency(p.price)} JD
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <ProductStatusBadge status={p.status} />

                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}