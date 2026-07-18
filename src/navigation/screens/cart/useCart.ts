import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@store";
import {
  emptyCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
} from "@store/slices/cartSlice";
import { getMessaging, getToken } from "@react-native-firebase/messaging";
import { API_ENDPOINTS } from "@constants";

export function useCart() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);

  const handleEmptyCart = () => {
    Alert.alert(t("emptyCart"), t("emptyCartConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("emptyCart"),
        style: "destructive",
        onPress: () => dispatch(emptyCart()),
      },
    ]);
  };

  const sendCheckoutNotification = async (count: number, totalAmount: number) => {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging);
      if (!token) {
        console.warn("[FCM] No token available to send checkout notification");
        return;
      }

      await fetch(API_ENDPOINTS.SEND_NOTIFICATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: t("orderPlacedNotificationTitle"),
          body: t("orderPlacedNotificationBody", {
            count,
            total: totalAmount.toFixed(2),
          }),
          data: {
            type: "order",
          },
        }),
      });
    } catch (error) {
      console.error("[FCM] Failed to send checkout notification:", error);
    }
  };

  const handleCheckout = () => {
    Alert.alert(
      t("orderPlaced"),
      t("orderPlacedBody", { count: itemCount, total: total.toFixed(2) }),
      [
        {
          text: t("great"),
          onPress: async () => {
            const currentItemCount = itemCount;
            const currentTotal = total;
            dispatch(emptyCart());
            await sendCheckoutNotification(currentItemCount, currentTotal);
          },
        },
      ],
    );
  };

  return {
    items,
    itemCount,
    total,
    handleEmptyCart,
    handleCheckout,
  };
}
