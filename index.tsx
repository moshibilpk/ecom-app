import "@expo/metro-runtime"; // Necessary for Fast Refresh on Web
import { registerRootComponent } from "expo";
import { getMessaging, setBackgroundMessageHandler } from "@react-native-firebase/messaging";
import { App } from "./src/App";

const messaging = getMessaging();
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  console.log("[FCM] Background message:", remoteMessage);
});

registerRootComponent(App);
