import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@models";
import type { RootState } from "../index";

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    resetNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, resetNotifications } =
  notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = createSelector(
  selectNotifications,
  (notifications) => notifications.filter((n) => !n.read).length,
);

export default notificationSlice.reducer;
