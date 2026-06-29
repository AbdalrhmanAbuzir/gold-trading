import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchProducts } from "../../store/slices/productSlice";
import ProductCard from "../../components/products/ProductCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import ErrorMessage from "../../components/common/ErrorMessage";
import { api } from "../../app/api/axios";
import { FaSearch, FaSlidersH, FaUndo } from "react-icons/fa";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error, totalPages, currentPage } = useAppSelector((s) => s.products);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [karat, setKarat] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load categories
  useEffect(() => {
    api.get("/Category")
      .then((r) => setCategories(r.data))
      .catch(() => {});
  }, []);

  const triggerFetch = (pageNum: number) => {
    dispatch(
      fetchProducts({
        page: pageNum,
        search: search || undefined,
        categoryId: categoryId || undefined,
        karat: karat ? Number(karat) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy || undefined,
      })
    );
  };

  // Automatically trigger fetch when page or filters change
  useEffect(() => {
    triggerFetch(page);
  }, [dispatch, page, categoryId, karat, minPrice, maxPrice, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    triggerFetch(1);
  };

  const handleReset = () => {
    setSearch("");
    setCategoryId("");
    setKarat("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">Gold Products</h1>
          <p className="text-gray-400 text-sm mt-1">Browse verified gold items from trusted sellers</p>
        </div>
      </div>

      {/* Main Search & Actions */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description…"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-500 transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
                showFilters || categoryId || karat || minPrice || maxPrice || sortBy !== "newest"
                  ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-gray-300"
              }`}
            >
              <FaSlidersH /> Filters
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-all"
              title="Reset Filters"
            >
              <FaUndo />
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/10"
            >
              Search
            </button>
          </div>
        </form>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800/80 animate-fadeIn">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Karat Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Karat Value</label>
              <select
                value={karat}
                onChange={(e) => { setKarat(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">All Karats</option>
                <option value="24">24K</option>
                <option value="21">21K</option>
                <option value="18">18K</option>
              </select>
            </div>

            {/* Min & Max Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Price Range (JD)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-gray-600 text-center"
                />
                <span className="text-gray-600 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-gray-600 text-center"
                />
              </div>
            </div>

            {/* Sorting Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="newest">Newest Listed</option>
                <option value="oldest">Oldest Listed</option>
                <option value="priceasc">Price: Low to High</option>
                <option value="pricedesc">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {items.length === 0 ? (
            <div className="text-center py-20 bg-slate-950 border border-slate-800 rounded-2xl text-gray-500 shadow-xl">
              <span className="text-5xl block mb-4">🎖️</span>
              <p className="text-sm">No gold products matching the filter criteria were found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
}
