import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

export default function GoldShopRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "GoldShop" && user?.role !== "Admin") return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}
