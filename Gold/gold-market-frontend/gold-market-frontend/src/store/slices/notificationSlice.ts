import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationService } from "../../services/notificationService";
import type { NotificationState } from "../../types";

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getMyNotifications();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to load notifications");
    }
  }
);

export const markAllRead = createAsyncThunk(
  "notifications/markAllRead",
  async (unreadIds: string[], { rejectWithValue }) => {
    try {
      await Promise.all(unreadIds.map((id) => notificationService.markAsRead(id)));
      return unreadIds;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || "Failed to mark notifications as read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter(
          (n: { isRead: boolean }) => !n.isRead
        ).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAllRead.fulfilled, (state, action) => {
        const markedIds = action.payload;
        state.items = state.items.map((n) =>
          markedIds.includes(n.id) ? { ...n, isRead: true } : n
        );
        state.unreadCount = state.items.filter((n) => !n.isRead).length;
      });
  },
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
