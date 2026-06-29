import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { goldShopService } from "../../services/goldShopService";
import type { GoldShopState } from "../../types";

const initialState: GoldShopState = {
  dashboard: null,
  orders: [],
  reservedOrders: [],
  completedOrders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  "goldshop/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await goldShopService.getDashboard();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load dashboard");
    }
  }
);

export const fetchGoldShopOrders = createAsyncThunk(
  "goldshop/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await goldShopService.getOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load orders");
    }
  }
);

export const fetchReservedOrders = createAsyncThunk(
  "goldshop/fetchReserved",
  async (_, { rejectWithValue }) => {
    try {
      return await goldShopService.getReservedOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load reserved orders");
    }
  }
);

export const fetchCompletedOrders = createAsyncThunk(
  "goldshop/fetchCompleted",
  async (_, { rejectWithValue }) => {
    try {
      return await goldShopService.getCompletedOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load completed orders");
    }
  }
);

export const fetchGoldShopOrderById = createAsyncThunk(
  "goldshop/fetchOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await goldShopService.getOrderById(id);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load order");
    }
  }
);

const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:5262/api";
};

export const mapOrder = (o: any): any => {
  if (!o) return null;
  const backendUrl = getApiUrl().replace(/\/api$/, "");
  let receiptImageUrl = undefined;
  if (o.receiptImageUrl) {
    receiptImageUrl = o.receiptImageUrl.startsWith("http")
      ? o.receiptImageUrl
      : `${backendUrl}${o.receiptImageUrl.startsWith("/") ? "" : "/"}${o.receiptImageUrl}`;
  }
  return {
    ...o,
    id: o.orderId || o.id,
    createdAt: o.reservedAt || o.createdAt,
    receiptImageUrl,
  };
};

const goldShopSlice = createSlice({
  name: "goldshop",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload
          ? {
              ...action.payload,
              latestOrders: action.payload.latestOrders
                ? action.payload.latestOrders.map(mapOrder)
                : [],
            }
          : null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGoldShopOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoldShopOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload ? action.payload.map(mapOrder) : [];
      })
      .addCase(fetchGoldShopOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReservedOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReservedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.reservedOrders = action.payload ? action.payload.map(mapOrder) : [];
      })
      .addCase(fetchReservedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCompletedOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompletedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.completedOrders = action.payload ? action.payload.map(mapOrder) : [];
      })
      .addCase(fetchCompletedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGoldShopOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoldShopOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = mapOrder(action.payload);
      })
      .addCase(fetchGoldShopOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedOrder, clearError } = goldShopSlice.actions;
export default goldShopSlice.reducer;
