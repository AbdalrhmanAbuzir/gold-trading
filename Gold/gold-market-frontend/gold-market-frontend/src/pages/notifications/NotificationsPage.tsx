import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchNotifications, markAllRead } from "../../store/slices/notificationSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { formatDateTime } from "../../utils/formatters";
import type { NotificationType } from "../../types";

const icons: Record<string, string> = {
  OrderReserved: "⏳",
  OrderCompleted: "✅",
  SystemAlert: "🔔",
  Order: "📦",
};

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { items, unreadCount, loading, error } = useAppSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-amber-600 mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllRead(items.filter((n) => !n.isRead).map((n) => n.id)))}
            className="text-sm text-amber-600 hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">🔔</div>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-colors ${
                !n.isRead ? "border-amber-200 bg-amber-50/30" : "border-gray-100"
              }`}
            >
              <div className="text-2xl flex-shrink-0">{icons[n.type] || "🔔"}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.isRead && (
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
