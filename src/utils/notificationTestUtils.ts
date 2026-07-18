import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { API_ENDPOINTS } from "@constants";

/** Predefined test notification templates with title and body */
const TEST_NOTIFICATIONS = [
  {
    title: "🛒 Order Confirmed!",
    body: "Your order #ORD-2026-042 has been confirmed and is being prepared.",
    type: "order" as const,
  },
  {
    title: "🎉 Flash Sale — 50% OFF!",
    body: "Limited time offer on all Electronics. Shop now before it ends!",
    type: "promo" as const,
  },
  {
    title: "📦 Package Shipped",
    body: "Your order #ORD-2026-041 is on its way. Estimated delivery: 2-3 days.",
    type: "order" as const,
  },
  {
    title: "💡 New Arrivals",
    body: "Fresh styles just dropped in Fashion & Accessories. Check them out!",
    type: "promo" as const,
  },
  {
    title: "🔒 Security Alert",
    body: "A new sign-in was detected on your account. Was this you?",
    type: "system" as const,
  },
];

export async function sendTestNotification(): Promise<void> {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);
    if (!token) {
      console.warn("[FCM] No token available to send test notification");
      return;
    }

    const template = TEST_NOTIFICATIONS[Math.floor(Math.random() * TEST_NOTIFICATIONS.length)];

    const response = await fetch(API_ENDPOINTS.SEND_NOTIFICATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        title: template.title,
        body: template.body,
        data: {
          type: template.type,
        },
      }),
    });

    const result = await response.json();
    console.log("[FCM] Test notification triggered via backend API:", result);
  } catch (error) {
    console.error("[FCM] Failed to send test notification via backend:", error);
  }
}
