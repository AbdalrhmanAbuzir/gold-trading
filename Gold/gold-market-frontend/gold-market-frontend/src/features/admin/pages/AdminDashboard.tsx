import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../adminService";
import { productService } from "../../../services/productService";
import { mapProduct } from "../../../store/slices/productSlice";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { 
  FaUser, 
  FaBox, 
  FaStore, 
  FaClock, 
  FaCheckCircle, 
  FaClipboardList,
  FaExclamationTriangle,
  FaChevronRight,
  FaEye
} from "react-icons/fa";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";

export default function AdminDashboard() {
  // Stats
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Data lists
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsData = await adminService.getDashboard();
      setStats(statsData);

      // Fetch users (for pending verification list)
      const usersData = await adminService.getUsers();
      setUsers(usersData);

      // Fetch orders (for live transaction feed)
      const ordersData = await adminService.getOrders();
      setOrders(ordersData); // store all for modal references if needed, but display first 5

      // Fetch products (for recent listings)
      const productsData = await productService.getAll({ pageSize: 5 });
      const items = productsData.items ?? productsData;
      setProducts(Array.isArray(items) ? items.slice(0, 4).map(mapProduct) : []);

    } catch (err: any) {
      setError(err?.response?.data || "Failed to load admin dashboard data.");
    } finally {
      setStatsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (statsLoading && loading) return <LoadingSpinner />;

  const pendingUsersList = users.filter(u => u.verificationStatus === "Pending");
  const displayOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 text-gray-100">
      {/* Welcome & Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">Gold Market Portal</h1>
          <p className="text-gray-400 text-xs mt-1">Monitor live gold reservations, verify buyer/seller identities, and track gold shop transactions.</p>
        </div>
        <button
          onClick={loadData}
          className="self-start md:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          Refresh Live Stream
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Platform Volume" value={`${stats.revenue} JD`} />
          <StatCard title="Total Orders" value={stats.ordersCount} />
          <StatCard title="Completed Trades" value={stats.completedOrders} />
          <StatCard title="Marketplace Listings" value={stats.productsCount} />
          
          {/* Actionable Stats Card */}
          <div className={`bg-slate-950 rounded-xl shadow-xl p-5 border transition duration-300 ${
            stats.pendingUsers > 0 
              ? "border-red-900/60 shadow-red-900/5 animate-pulse-slow" 
              : "border-slate-800"
          }`}>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Awaiting Verification</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-bold ${stats.pendingUsers > 0 ? "text-red-400" : "text-amber-500"}`}>
                {stats.pendingUsers}
              </span>
              {stats.pendingUsers > 0 && (
                <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-900/40 px-2 py-0.5 rounded-full font-bold">
                  Action Required
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Main layout: Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle 2 Columns: Live Trade Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Gold Reservations Feed */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <FaClipboardList /> Recent Gold Reservations
              </h2>
              <Link to="/admin/orders" className="text-xxs text-amber-500 hover:underline flex items-center gap-1">
                View All Orders <FaChevronRight />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-slate-800/80">
                    <th className="py-2.5 font-semibold">Gold Item</th>
                    <th className="py-2.5 font-semibold">Trade Route</th>
                    <th className="py-2.5 font-semibold">Gold Shop Location</th>
                    <th className="py-2.5 font-semibold text-right">Locked Price</th>
                    <th className="py-2.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {displayOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-3">
                        <div className="font-semibold text-gray-200">{o.productTitle}</div>
                        <div className="text-[10px] text-gray-500 font-mono">ID: {o.id.substring(0, 8)}…</div>
                      </td>
                      <td className="py-3">
                        <div className="text-gray-300">
                          <span className="font-semibold text-gray-400">{o.buyerName}</span> (Buyer)
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Seller: {o.sellerName}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 text-gray-300">
                          <FaStore className="text-amber-500 text-xxs shrink-0" />
                          <span className="truncate max-w-[120px]">{o.goldShopName}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-bold text-amber-500">
                        {o.lockedPrice} JD
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            o.status === "Completed"
                              ? "bg-green-950/60 text-green-400 border border-green-900/40"
                              : o.status === "Reserved"
                              ? "bg-blue-950/60 text-blue-400 border border-blue-900/40"
                              : "bg-red-950/60 text-red-400 border border-red-900/40"
                          }`}>
                            {o.status}
                          </span>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="p-1 bg-slate-800 hover:bg-amber-500 hover:text-black border border-slate-700 rounded text-gray-300 transition-colors"
                            title="View details"
                          >
                            <FaEye className="text-[10px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-8">
                        No transactions registered on the platform yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Newly Listed Products */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <FaBox /> Recent Marketplace Additions
              </h2>
              <Link to="/admin/products" className="text-xxs text-amber-500 hover:underline flex items-center gap-1">
                Browse Marketplace <FaChevronRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedProduct(p)}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 flex gap-3 hover:border-amber-500/30 transition duration-300 cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center shrink-0">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <span className="text-2xl">🏅</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-200 text-xs truncate group-hover:text-amber-500 transition-colors">{p.title}</h4>
                      <p className="text-[10px] text-gray-500 truncate">Seller: {p.sellerName}</p>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                      <div className="flex gap-2 text-[10px] text-gray-400">
                        <span>{p.weight}g</span>
                        <span>{p.karat}K</span>
                      </div>
                      <div className="text-xs font-bold text-amber-500">{p.price} JD</div>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="col-span-2 text-center text-gray-500 py-6">
                  No active listings found in the marketplace.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: User Identity Verification Queue */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                  <FaUser /> Identity Queue
                </h2>
                <Link to="/admin/users" className="text-xxs text-amber-500 hover:underline">
                  All Users
                </Link>
              </div>

              {pendingUsersList.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl text-xxs flex gap-2 items-start">
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold">Pending Approval Action Required</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">These users cannot buy or sell gold until you verify their selfie photographs and ID cards.</p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-800/60 max-h-[380px] overflow-y-auto pr-1">
                    {pendingUsersList.map((u) => (
                      <div key={u.id} className="py-3 flex items-center justify-between gap-2 first:pt-0">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-gray-200 truncate">{u.fullName}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-950/50 text-yellow-400 border border-yellow-900/30 text-[9px] font-semibold rounded-full animate-pulse-slow">
                            Pending Review
                          </span>
                        </div>
                        <Link
                          to={`/admin/users?userId=${u.id}`}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xxs transition-colors shrink-0"
                        >
                          Verify User
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <FaCheckCircle className="mx-auto text-3xl mb-3 text-green-500/50" />
                  <p className="text-xs">All registered user accounts are currently verified!</p>
                  <p className="text-[10px] text-gray-600 mt-1">New registration requests will appear here.</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800/80 mt-6 pt-4 text-xxs text-gray-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <FaClock className="text-amber-500/70" />
                <span>Verification logs are recorded securely.</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Modals section */}
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs transition-colors"
            >
              Close
            </button>
            <h3 className="text-lg font-bold text-amber-500 mb-1">{selectedProduct.title}</h3>
            <p className="text-[10px] text-gray-500 font-mono mb-4">Product ID: {selectedProduct.id}</p>
            
            <div className="w-full h-56 bg-slate-900 rounded-xl overflow-hidden mb-4 border border-slate-800 flex items-center justify-center">
              {selectedProduct.imageUrl ? (
                <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">🏅</span>
              )}
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                <span className="text-[10px] text-gray-500 block">Description</span>
                <p className="leading-relaxed mt-0.5">{selectedProduct.description || "No description provided."}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Weight</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{selectedProduct.weight}g</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Karat</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{selectedProduct.karat}K</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Category</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{selectedProduct.categoryName || "Gold"}</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Status</span>
                  <span className="font-semibold text-amber-500 mt-0.5 block">{selectedProduct.status}</span>
                </div>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-500 block">Seller Account</span>
                  <span className="font-semibold text-gray-200 block">{selectedProduct.sellerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">Current Value</span>
                  <span className="text-base font-extrabold text-amber-500">{selectedProduct.price} JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs transition-colors"
            >
              Close
            </button>
            <h3 className="text-lg font-bold text-amber-500 mb-1">Reservation Transaction</h3>
            <p className="text-[10px] text-gray-500 font-mono mb-4">Order ID: {selectedOrder.id}</p>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                <span className="text-[10px] text-gray-500 block">Gold Product</span>
                <span className="font-semibold text-gray-200 text-sm mt-0.5 block">{selectedOrder.productTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Buyer (Reserved By)</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{selectedOrder.buyerName}</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Seller (Listed By)</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{selectedOrder.sellerName}</span>
                </div>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                <span className="text-[10px] text-gray-500 block">Assigned Verification Shop</span>
                <div className="flex items-center gap-1.5 mt-1 font-semibold text-amber-500">
                  <FaStore className="text-xs" />
                  <span>{selectedOrder.goldShopName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Verification Status</span>
                  <span className="font-semibold text-amber-500 mt-0.5 block">{selectedOrder.status}</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                  <span className="text-[10px] text-gray-500 block">Reserved Date</span>
                  <span className="font-semibold text-gray-200 mt-0.5 block">{formatDateTime(selectedOrder.createdAt)}</span>
                </div>
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-500 block">Completed Date</span>
                  <span className="font-semibold text-gray-200 block">
                    {selectedOrder.completedAt ? formatDateTime(selectedOrder.completedAt) : "Awaiting shop verification"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">Locked Price</span>
                  <span className="text-base font-extrabold text-amber-500">{selectedOrder.lockedPrice} JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}