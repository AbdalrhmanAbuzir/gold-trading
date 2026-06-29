import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";
import type { ProductsState, PaginationParams } from "../../types";

const extractErrorMessage = (err: unknown, defaultMsg: string): string => {
  const e = err as { response?: { data?: any } };
  if (e.response?.data) {
    const data = e.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.errors) {
      return Object.entries(data.errors)
        .map(([field, msgs]) => `${field}: ${(msgs as any).join ? (msgs as any).join(", ") : msgs}`)
        .join(" | ");
    }
    if (data.title) return data.title;
  }
  return defaultMsg;
};

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  myProducts: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params: PaginationParams | undefined, { rejectWithValue }) => {
    try {
      return await productService.getAll(params);
    } catch (err: unknown) {
      console.error("Fetch products error:", err);
      return rejectWithValue(extractErrorMessage(err, "Failed to load products"));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await productService.getById(id);
    } catch (err: unknown) {
      console.error("Fetch product error:", err);
      return rejectWithValue(extractErrorMessage(err, "Failed to load product"));
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await productService.create(formData);
    } catch (err: unknown) {
      console.error("Create product error:", err);
      return rejectWithValue(extractErrorMessage(err, "Failed to create product"));
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      return await productService.update(id, formData);
    } catch (err: unknown) {
      console.error("Update product error:", err);
      return rejectWithValue(extractErrorMessage(err, "Failed to update product"));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await productService.delete(id);
      return id;
    } catch (err: unknown) {
      console.error("Delete product error:", err);
      return rejectWithValue(extractErrorMessage(err, "Failed to delete product"));
    }
  }
);

const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:5262/api";
};

export const mapProduct = (p: any): any => {
  if (!p) return null;
  const backendUrl = getApiUrl().replace(/\/api$/, "");
  
  let imageUrl = undefined;
  let resolvedImages = [];
  
  if (p.images && Array.isArray(p.images)) {
    resolvedImages = p.images.map((img: any) => {
      const rawUrl = img.imageUrl || img;
      const url = rawUrl.startsWith("http")
        ? rawUrl
        : `${backendUrl}/uploads/products/${rawUrl.replace(/^\/?uploads\/products\//, "")}`;
      return {
        id: img.id || Math.random().toString(),
        imageUrl: url
      };
    });
  }

  if (resolvedImages.length > 0) {
    imageUrl = resolvedImages[0].imageUrl;
  } else if (p.imageUrl) {
    imageUrl = p.imageUrl.startsWith("http")
      ? p.imageUrl
      : `${backendUrl}/uploads/products/${p.imageUrl.replace(/^\/?uploads\/products\//, "")}`;
  }
  
  return {
    ...p,
    price: p.finalPrice ?? p.fixedPrice ?? p.price ?? 0,
    imageUrl,
    images: resolvedImages
  };
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const rawItems = action.payload.items ?? action.payload;
        state.items = Array.isArray(rawItems) ? rawItems.map(mapProduct) : [];
        state.totalPages = action.payload.totalPages ?? 1;
        state.currentPage = action.payload.currentPage ?? 1;
        state.totalCount = action.payload.totalCount ?? state.items.length ?? 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = mapProduct(action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.myProducts = state.myProducts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
