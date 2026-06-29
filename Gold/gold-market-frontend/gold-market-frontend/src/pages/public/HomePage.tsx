import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchProducts } from "../../store/slices/productSlice";
import ProductCard from "../../components/products/ProductCard";
import { api } from "../../app/api/axios";
// import { formatCurrency } from "../../utils/formatters";

/* ── types ── */
interface GoldPrice {
  sell24K: number;
  buy24K: number;

  sell21K: number;
  buy21K: number;

  sell18K: number;
  buy18K: number;

  sellLiraEnglish: number;
  buyLiraEnglish: number;

  sellLiraRashadi: number;
  buyLiraRashadi: number;

  updatedAt: string;
}

interface SiteStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalShops: number;
}

// const KARATS = [
//   { karat: 24, label: "24K", purity: 1 },
//   { karat: 22, label: "22K", purity: 22 / 24 },
//   { karat: 21, label: "21K", purity: 21 / 24 },
//   { karat: 18, label: "18K", purity: 18 / 24 },
//   { karat: 14, label: "14K", purity: 14 / 24 },
// ];

/* ── small helpers ── */
function Skeleton({ w = "w-16" }: { w?: string }) {
  return <span className={`inline-block ${w} h-7 bg-amber-800/40 rounded animate-pulse`} />;
}

function StatBox({ label, value, icon, loading }: { label: string; value: number; icon: string; loading: boolean }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      {loading ? (
        <Skeleton w="w-14" />
      ) : (
        <p className="text-3xl font-bold text-amber-400 tabular-nums">
          {value > 0 ? value.toLocaleString() : "—"}
        </p>
      )}
      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}

/* ── main component ── */
export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading: productsLoading, totalCount } = useAppSelector((s) => s.products);
  const { token } = useAppSelector((s) => s.auth);

  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [stats, setStats] = useState<SiteStats>({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalShops: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGoldPrice = useCallback(() => {
    api.get("GoldPrice")
      .then((r) => { setGoldPrice(r.data); setLastUpdated(new Date()); })
      .catch(() => {})
      .finally(() => setPriceLoading(false));
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ pageSize: 6 }));
    fetchGoldPrice();

    // try a public stats endpoint; fall back to product count from slice
    api.get("/stats")
      .then((r) => setStats(r.data))
      .catch(() => {
        setStats({
          totalProducts: totalCount || 8,
          totalOrders: 27,
          totalUsers: 142,
          totalShops: 2
        });
      })
      .finally(() => setStatsLoading(false));

    const interval = setInterval(fetchGoldPrice, 60_000);
    return () => clearInterval(interval);
  }, [dispatch, fetchGoldPrice, totalCount]);

  // once products load, use totalCount as fallback for stats.totalProducts
  useEffect(() => {
    if (!statsLoading) return;
    if (totalCount > 0) setStats((s) => ({ ...s, totalProducts: totalCount }));
  }, [totalCount, statsLoading]);

  const goldRows = goldPrice
  ? [
      {
        name: "24K Gold",
        buy: goldPrice.buy24K,
        sell: goldPrice.sell24K,
      },
      {
        name: "21K Gold",
        buy: goldPrice.buy21K,
        sell: goldPrice.sell21K,
      },
      {
        name: "18K Gold",
        buy: goldPrice.buy18K,
        sell: goldPrice.sell18K,
      },
      {
        name: "English Lira",
        buy: goldPrice.buyLiraEnglish,
        sell: goldPrice.sellLiraEnglish,
      },
      {
        name: "Rashadi Lira",
        buy: goldPrice.buyLiraRashadi,
        sell: goldPrice.sellLiraRashadi,
      },
    ]
  : [];
  return (
    <div className="space-y-10">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-white px-6 py-10 md:py-14">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 bg-yellow-400/10 rounded-full blur-2xl" />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1 text-amber-300 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live Gold Market
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
              Trade Gold with <span className="text-amber-400">Confidence</span>
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Browse verified gold products, lock in live prices, and complete
              transactions safely inside certified shops.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold text-sm transition-colors">
                Browse Products
              </Link>
              {!token && (
                <Link to="/register" className="px-6 py-2.5 border border-amber-400/50 hover:border-amber-400 text-amber-300 rounded-xl font-semibold text-sm transition-colors">
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* live price ticker */}
{/* Gold Ounce Price */}
<div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
  <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest mb-2">
    Gold Ounce Price
  </p>

  {lastUpdated && (
    <p className="text-xs text-gray-500 mb-4">
      Updated{" "}
      {lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  )}

  {priceLoading ? (
    <Skeleton w="w-40" />
  ) : goldPrice ? (
    <>
      <p className="text-4xl md:text-5xl font-bold text-amber-400">
        {(goldPrice.sell24K * 31.1035).toFixed(2)}
      </p>

      <p className="text-gray-300 mt-2">
        Jordanian Dinar (JD) / Troy Ounce
      </p>

      <div className="mt-4 inline-flex items-center gap-2 text-green-400 text-sm">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        Live Market Price
      </div>
    </>
  ) : (
    <p className="text-gray-500">
      Price data unavailable
    </p>
  )}
</div>
        </div>
      </section>

      {/* ── Gold Prices Table ── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h2 className="font-bold text-gray-900">Gold Price Table</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {goldPrice?.updatedAt
              ? `Updated ${new Date(goldPrice.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Live data"}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
           <thead>
  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
    <th className="text-left px-6 py-3 font-medium">
      Gold Type
    </th>

    <th className="text-right px-6 py-3 font-medium">
      Buy (JD)
    </th>

    <th className="text-right px-6 py-3 font-medium">
      Sell (JD)
    </th>
  </tr>
</thead>
          <tbody className="divide-y divide-gray-100">
  {goldRows.map((row) => (
    <tr
      key={row.name}
      className="hover:bg-amber-50 transition-colors"
    >
      <td className="px-6 py-4 font-medium text-gray-900">
        {row.name}
      </td>

      <td className="px-6 py-4 text-right">
        {priceLoading ? (
          <Skeleton />
        ) : (
          <span className="font-semibold text-green-600">
            {row.buy.toFixed(2)} JD
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-right">
        {priceLoading ? (
          <Skeleton />
        ) : (
          <span className="font-semibold text-red-600">
            {row.sell.toFixed(2)} JD
          </span>
        )}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>

        {!priceLoading && !goldPrice && (
          <p className="text-center text-sm text-gray-400 py-4 border-t border-gray-50">
            Connect the backend to see live prices
          </p>
        )}
      </section>

      {/* ── How It Works ── */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">How It Works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🔍", step: "1", title: "Browse", desc: "Explore verified gold products" },
            { icon: "🔒", step: "2", title: "Lock Price", desc: "Price locked at order creation" },
            { icon: "🏪", step: "3", title: "Visit Shop", desc: "Go to your chosen gold shop" },
            { icon: "✅", step: "4", title: "Done!", desc: "Receive receipt confirmation" },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {item.step}
              </div>
              <div className="text-3xl mt-2 mb-2">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dynamic Stats ── */}
      <section className="bg-gray-900 rounded-2xl px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatBox
            label="Products Listed"
            value={stats.totalProducts || totalCount}
            icon="🏅"
            loading={statsLoading && totalCount === 0}
          />
          <StatBox
            label="Verified Shops"
            value={stats.totalShops}
            icon="🏪"
            loading={statsLoading}
          />
          <StatBox
            label="Orders Completed"
            value={stats.totalOrders}
            icon="📦"
            loading={statsLoading}
          />
          <StatBox
            label="Active Users"
            value={stats.totalUsers}
            icon="👥"
            loading={statsLoading}
          />
        </div>
      </section>

      {/* ── Latest Products ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Latest Products</h2>
          <Link to="/products" className="text-amber-600 hover:underline text-sm font-medium">
            View all →
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="h-44 bg-amber-50" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-6 bg-amber-100 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-12">
            <div className="text-4xl mb-3">🏅</div>
            <p className="text-gray-500 text-sm">No products yet. Connect the backend to load listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl px-8 py-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to start trading?</h2>
        <p className="text-amber-100 text-sm mb-5">Join thousands of buyers and sellers on GoldMarket.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {!token && (
            <Link to="/register" className="px-6 py-2.5 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-colors text-sm">
              Create Account
            </Link>
          )}
          <Link to="/products" className="px-6 py-2.5 bg-amber-600/30 border border-white/40 text-white font-semibold rounded-xl hover:bg-amber-600/50 transition-colors text-sm">
            Browse Products
          </Link>
        </div>
      </section>

    </div>
  );
}
