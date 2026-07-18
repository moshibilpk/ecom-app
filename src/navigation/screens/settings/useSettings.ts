import { Alert } from "react-native";
import { auth } from "@config/firebase";
import { useAppDispatch, useAppSelector } from "@store";
import { clearUser } from "@store/slices/authSlice";
import { emptyCart } from "@store/slices/cartSlice";
import { resetNotifications } from "@store/slices/notificationSlice";
import { sendTestNotification } from "@utils/notificationTestUtils";

export function useSettings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = user?.username ? getInitials(user.username) : "?";

  const onLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await auth().signOut();
          } catch {
            // sign out locally even if Firebase fails
          }
          dispatch(clearUser());
          dispatch(emptyCart());
          dispatch(resetNotifications());
        },
      },
    ]);
  };

  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert(
        "Sent!",
        "Check your notifications tab. (Put the app in background to see a real push banner!)",
      );
    } catch (error) {
      console.log("🚀 ~ handleSendTestNotification ~ error:", error);
      Alert.alert("Error", "Failed to contact the backend server.");
    }
  };

  return {
    user,
    userInitials,
    onLogout,
    handleSendTestNotification,
  };
}
