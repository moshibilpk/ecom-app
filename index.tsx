import "@expo/metro-runtime"; // Necessary for Fast Refresh on Web
import { registerRootComponent } from "expo";
import { getMessaging, setBackgroundMessageHandler } from "@react-native-firebase/messaging";
import { DeviceEventEmitter } from "react-native";
import { App } from "./src/App";

const messaging = getMessaging();
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  console.log("[FCM] Background message:", remoteMessage);
  DeviceEventEmitter.emit("fcm_background_message", remoteMessage);
});

registerRootComponent(App);
