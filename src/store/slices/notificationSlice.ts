import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@models";
import type { RootState } from "../index";

interface NotificationState {
  notifications: Notification[];
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "🛒 Order Confirmed!",
    body: "Your order #ORD-2025-001 has been confirmed and is being prepared.",
    timestamp: Date.now() - 1000 * 60 * 5,
    read: false,
    type: "order",
  },
  {
    id: "n2",
    title: "🎉 Flash Sale — 40% OFF!",
    body: "Limited time offer on all Electronics. Shop now before it ends!",
    timestamp: Date.now() - 1000 * 60 * 30,
    read: false,
    type: "promo",
  },
  {
    id: "n3",
    title: "📦 Package Shipped",
    body: "Your order #ORD-2025-000 is on its way. Estimated delivery: 2-3 days.",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    read: false,
    type: "order",
  },
  {
    id: "n4",
    title: "💡 New Arrivals",
    body: "Fresh styles just dropped in Fashion & Accessories. Check them out!",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    type: "promo",
  },
  {
    id: "n5",
    title: "🔒 Security Alert",
    body: "A new sign-in was detected on your account. Was this you?",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    read: true,
    type: "system",
  },
];

const initialState: NotificationState = {
  notifications: MOCK_NOTIFICATIONS,
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
      state.notifications = MOCK_NOTIFICATIONS;
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
