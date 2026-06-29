import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { authService } from "../../services/authService";
import type { AuthState, User } from "../../types";

interface DecodedToken {
  sub?: string;
  nameid?: string;
  email?: string;
  unique_name?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  role?: string;
  FullName?: string;
  Phone?: string;
  IsApproved?: string;
  VerificationStatus?: string;
  exp?: number;
}

function parseUser(token: string): User {
  const decoded = jwtDecode<DecodedToken>(token);
  const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    decoded.role || "User";
  const role = (rawRole === "Customer" ? "User" : rawRole) as User["role"];
  return {
    id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      decoded.nameid || decoded.sub || "",
    email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      decoded.email || decoded.unique_name || "",
    fullName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      decoded.unique_name ||
      decoded.FullName ||
      "",
    phone: decoded.Phone || "",
    role,
    isApproved: decoded.VerificationStatus === "Approved" || decoded.IsApproved === "True",
  };
}

const savedToken = localStorage.getItem("token");
const initialState: AuthState = {
  token: savedToken,
  user: savedToken ? parseUser(savedToken) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      return res.token as string;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await authService.register(formData);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.user = parseUser(action.payload);
        localStorage.setItem("token", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
