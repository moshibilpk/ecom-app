import { Alert } from "react-native";
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
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);

  const handleEmptyCart = () => {
    Alert.alert("Empty Cart", "Are you sure you want to remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Empty Cart",
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
          title: "📦 Order Placed successfully!",
          body: `Your order of ${count} item(s) worth $${totalAmount.toFixed(2)} has been placed successfully!`,
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
      "🎉 Order Placed!",
      `Your order of ${itemCount} item(s) worth $${total.toFixed(2)} has been placed successfully!`,
      [
        {
          text: "Great!",
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
