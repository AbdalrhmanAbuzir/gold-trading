import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../services/profileService";
import type { ProfileState, Product, Order } from "../../types";
import { mapProduct, deleteProduct } from "./productSlice";

interface ProfileFullState extends ProfileState {
  myProducts: Product[];
  myOrders: Order[];
  mySales: any[];
}

const initialState: ProfileFullState = {
  profile: null,
  myProducts: [],
  myOrders: [],
  mySales: [],
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.get();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await profileService.update(formData);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to update profile");
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  "profile/myProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.myProducts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load your products");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "profile/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.myOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load your orders");
    }
  }
);

export const fetchMySales = createAsyncThunk(
  "profile/mySales",
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.mySales();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load your sales");
    }
  }
);

const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:5262/api";
};

export const mapProfile = (p: any): any => {
  if (!p) return null;
  const backendUrl = getApiUrl().replace(/\/api$/, "");
  let profileImageUrl = undefined;
  if (p.profileImageUrl) {
    profileImageUrl = p.profileImageUrl.startsWith("http")
      ? p.profileImageUrl
      : `${backendUrl}${p.profileImageUrl.startsWith("/") ? "" : "/"}${p.profileImageUrl}`;
  }
  return {
    ...p,
    profileImageUrl,
    isApproved: p.verificationStatus === "Approved",
  };
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = mapProfile(action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = mapProfile(action.payload);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myProducts = Array.isArray(action.payload)
          ? action.payload.map(mapProduct)
          : [];
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
      })
      .addCase(fetchMySales.fulfilled, (state, action) => {
        state.mySales = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.myProducts = state.myProducts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
