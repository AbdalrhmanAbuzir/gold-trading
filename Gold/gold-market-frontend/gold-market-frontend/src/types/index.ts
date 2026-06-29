export type Role = "Customer" | "User" | "GoldShop" | "Admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  isApproved: boolean;
  profileImageUrl?: string;
  roles?: string[];
  createdAt?: string;
  verificationStatus?: string;
}

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

export type ProductStatus = "Available" | "Reserved" | "Sold";

export interface Product {
  id: string;
  title: string;
  description: string;
  weight: number;
  karat: number;
  price: number;
  status: ProductStatus;
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  goldShops?: { id: string; name: string; address?: string }[];
  pricingType?: number;
  fixedPrice?: number;
  priceAdjustmentPerGram?: number;
  manufacturingType?: number;
  manufacturingValue?: number;
  images?: { id: string; imageUrl: string }[];
}

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  myProducts: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export type OrderStatus = "Reserved" | "Completed" | "Expired" | "Cancelled";

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  sellerId?: string;
  sellerName?: string;
  sellerPhone?: string;
  goldShopId: string;
  goldShopName: string;
  lockedPrice: number;
  status: OrderStatus;
  receiptImageUrl?: string;
  notes?: string;
  createdAt: string;
  expiresAt: string;
  completedAt?: string;
  reservedAt?: string;
  reservedUntil?: string;
}

export interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  myOrders: Order[];
  loading: boolean;
  error: string | null;
}

export interface GoldShopDashboard {
  totalOrders: number;
  reservedOrders: number;
  completedOrders: number;
  totalRevenue: number;
  latestOrders: Order[];
}

export interface GoldShopState {
  dashboard: GoldShopDashboard | null;
  orders: Order[];
  reservedOrders: Order[];
  completedOrders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export type NotificationType = "OrderReserved" | "OrderCompleted" | "SystemAlert";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export interface GoldPrice {
  pricePerGram: number;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  karat?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}
