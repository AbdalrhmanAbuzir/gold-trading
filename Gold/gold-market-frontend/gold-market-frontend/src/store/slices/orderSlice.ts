import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services/orderService";
import { profileService } from "../../services/profileService";
import type { OrderState } from "../../types";

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  myOrders: [],
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "orders/create",
  async (data: { productId: string; goldShopId: string }, { rejectWithValue }) => {
    try {
      return await orderService.create(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to create order");
    }
  }
);

export const completeOrder = createAsyncThunk(
  "orders/complete",
  async (
    { data, receiptFile }: { data: { orderId: string; notes?: string }; receiptFile?: File },
    { rejectWithValue }
  ) => {
    try {
      return await orderService.complete(data, receiptFile);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to complete order");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await orderService.cancel({ orderId });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to cancel order");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await orderService.getById(id);
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
    receiptImageUrl,
  };
};

const orderSlice = createSlice({
  name: "orders",
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
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = mapOrder(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = mapOrder(action.payload);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        state.selectedOrder = mapOrder(action.payload);
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.selectedOrder = mapOrder(action.payload);
      });
  },
});

export const { clearSelectedOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
