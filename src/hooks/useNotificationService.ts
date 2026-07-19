import { useEffect } from "react";
import { Platform, DeviceEventEmitter } from "react-native";
import {
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import { requestNotifications, RESULTS } from "react-native-permissions";
import { useAppDispatch, useAppSelector } from "@store";
import { addNotification } from "@store/slices/notificationSlice";
import { API_ENDPOINTS } from "@constants";

/**
 * Register FCM device token with the backend API.
 */
async function registerDeviceToken(userId: string, token: string) {
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
        platform: Platform.OS,
      }),
    });
    const result = await response.json();
    console.log("[FCM] Registered token with backend:", result);
  } catch (error) {
    console.error("[FCM] Failed to register token with backend:", error);
  }
}

export function useNotificationService() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => {
    return state.auth.user;
  });
  const userId = user?.uid;

  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeTokenRefresh: (() => void) | undefined;
    let emitterSubscription: { remove: () => void } | undefined;

    async function bootstrap() {
      if (!userId) {
        console.log("[FCM] No user logged in, skipping setup");
        return;
      }
      const messaging = getMessaging();

      // ── 1. Request permissions ──────────────────────────
      const { status } = await requestNotifications(["alert", "sound", "badge"]);
      const isAuthorized = status === RESULTS.GRANTED || status === RESULTS.LIMITED;

      if (!isAuthorized) {
        console.warn("[FCM] Notification permission denied");
        return;
      }

      // ── 2. Get and register FCM token ───────────────────
      try {
        const token = await getToken(messaging);
        console.log("🚀 ~ bootstrap ~ token:", token);
        if (token) {
          await registerDeviceToken(userId, token);
        }
      } catch (error) {
        console.error("[FCM] Failed to get token:", error);
      }

      // ── 3. Foreground message listener ──────────────────
      // When the app is open, Firebase does NOT automatically show a notification banner.
      // We add the message to Redux so it appears in the Notifications tab.
      unsubscribeMessage = onMessage(messaging, async (remoteMessage) => {
        console.log("[FCM] Foreground message:", remoteMessage);

        const { notification, data, messageId } = remoteMessage;
        const title = notification?.title;
        const body = notification?.body;
        if (!title || !body) return;
        const type = (data?.type as "order" | "promo" | "system") ?? "system";
        const id = messageId ?? `fcm-${Date.now()}`;

        dispatch(
          addNotification({
            id,
            title,
            body,
            timestamp: Date.now(),
            read: false,
            type,
          }),
        );
      });

      // ── 4. Token refresh listener ────────────────────────
      unsubscribeTokenRefresh = onTokenRefresh(messaging, async (newToken) => {
        console.log("[FCM] Token refreshed:", newToken);
        await registerDeviceToken(userId, newToken);
      });

      // ── 5. Emitter listener for background messages ──────
      emitterSubscription = DeviceEventEmitter.addListener(
        "fcm_background_message",
        (remoteMessage) => {
          console.log("[FCM] Received background message via emitter:", remoteMessage);
          const { notification, data, messageId } = remoteMessage;
          const title = notification?.title;
          const body = notification?.body;
          if (!title || !body) return;
          const type = (data?.type as "order" | "promo" | "system") ?? "system";
          const id = messageId ?? `fcm-${Date.now()}`;

          dispatch(
            addNotification({
              id,
              title,
              body,
              timestamp: Date.now(),
              read: false,
              type,
            }),
          );
        },
      );
    }

    bootstrap();

    return () => {
      unsubscribeMessage?.();
      unsubscribeTokenRefresh?.();
      emitterSubscription?.remove();
    };
  }, [dispatch, userId]);
}
