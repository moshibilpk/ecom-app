import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { auth } from "@config/firebase";
import { signOut } from "@react-native-firebase/auth";
import { useAppDispatch, useAppSelector } from "@store";
import { clearUser } from "@store/slices/authSlice";
import { emptyCart } from "@store/slices/cartSlice";
import { resetNotifications } from "@store/slices/notificationSlice";
import { sendTestNotification } from "@utils/notificationTestUtils";
import { setLanguage } from "@store/slices/languageSlice";

export function useSettings() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currentLanguage = useAppSelector((state) => state.language.language);

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
    Alert.alert(t("logout"), t("logoutConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logout"),
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            console.log("🚀 ~ onLogout ~ error:", error);
          } finally {
            dispatch(clearUser());
            dispatch(emptyCart());
            dispatch(resetNotifications());
          }
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

  const onSelectLanguage = () => {
    Alert.alert(t("languageSelect"), "", [
      {
        text: t("english"),
        onPress: () => {
          if (currentLanguage !== "en") {
            dispatch(setLanguage("en"));
          }
        },
      },
      {
        text: t("arabic"),
        onPress: () => {
          if (currentLanguage !== "ar") {
            dispatch(setLanguage("ar"));
          }
        },
      },
      {
        text: t("cancel"),
        style: "cancel",
      },
    ]);
  };

  const currentLanguageName = currentLanguage === "ar" ? t("arabic") : t("english");

  return {
    t,
    user,
    userInitials,
    currentLanguageName,
    onLogout,
    handleSendTestNotification,
    onSelectLanguage,
  };
}
