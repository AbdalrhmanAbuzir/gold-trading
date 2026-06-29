import { useEffect, useState } from "react";
import { adminService } from "../adminService";
import { FaStore, FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";

export default function AdminGoldShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getGoldShops();
      setShops(data);
    } catch (err: any) {
      setError("Failed to load gold shops listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
  }, []);

  if (loading && shops.length === 0) return <LoadingSpinner />;

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-2">
          <FaStore /> Verified Gold Shops
        </h1>
        <button
          onClick={loadShops}
          className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {shops.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl text-center py-20 text-gray-500 shadow-xl">
          <FaStore className="mx-auto text-5xl mb-4 text-slate-800" />
          <p className="text-sm">No verified gold shops are currently configured in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
                    <FaStore className="text-lg" />
                  </div>
                  <span className="px-2.5 py-1 bg-green-950 text-green-400 border border-green-800 rounded-full text-xxs font-medium flex items-center gap-1">
                    <FaShieldAlt /> Verified
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-200 mb-1">{shop.name}</h3>
                <p className="text-gray-500 text-xxs mb-3 font-mono">ID: {shop.id}</p>

                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-amber-500" />
                    <span>{shop.address || "No address details available"}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 mt-5 pt-3 flex items-center justify-between text-xxs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <FaCalendarAlt />
                  <span>Platform Shop Partner</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
