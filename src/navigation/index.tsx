import React, { Fragment } from "react";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "@react-navigation/elements";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useTranslation } from "react-i18next";
import { persistor, store, useAppSelector } from "@store";
import { Colors, Typography } from "@constants/theme";
import { ScreenName } from "@constants/ScreenNames";
import bell from "@assets/bell.png";
import newspaper from "@assets/newspaper.png";
import { LoginScreen, SignupScreen, Home, CartScreen, Notification, Settings } from "./screens";
import { selectCartItemCount } from "@store/slices/cartSlice";
import { selectUnreadCount } from "@store/slices/notificationSlice";
import { useNotificationService } from "@hooks/useNotificationService";
import { FontFamily } from "@constants";
import { LanguageProvider } from "@components";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "@language/i18n";

// ──────────────────────────────────────────────
// Navigators
// ──────────────────────────────────────────────
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/** Exported ref for imperative navigation outside of components */
export const navigationRef = createNavigationContainerRef<Record<ScreenName, undefined>>();

const screenOptions = { headerShown: false };

// ──────────────────────────────────────────────
// Badge Component for tab bar icons
// ──────────────────────────────────────────────
function TabBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={badgeStyles.badge}>
      <Text style={badgeStyles.badgeText}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: "#FF5252",
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});

function CartTabIcon({ color, size }: { color: string; size: number }) {
  const count = useAppSelector(selectCartItemCount);
  return (
    <View>
      <Text style={{ fontSize: size - 4, color }}>🛒</Text>
      <TabBadge count={count} />
    </View>
  );
}

function NotificationTabIcon({ color, size }: { color: string; size: number }) {
  const count = useAppSelector(selectUnreadCount);
  return (
    <View>
      <Image source={bell} tintColor={color} style={{ width: size, height: size }} />
      <TabBadge count={count} />
    </View>
  );
}

const tabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: Colors.tabActive,
  tabBarInactiveTintColor: Colors.tabInactive,
  tabBarStyle: {
    backgroundColor: Colors.tabBackground,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 80,
  },
  tabBarLabelStyle: {
    fontFamily: FontFamily.SemiBold,
  },
};

function BottomTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name={ScreenName.Home}
        component={Home}
        options={{
          title: t("shop"),
          tabBarIcon: ({ color, size }) => (
            <Image source={newspaper} tintColor={color} style={{ width: size, height: size }} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenName.Cart}
        component={CartScreen}
        options={{
          title: t("cart"),
          tabBarIcon: CartTabIcon,
        }}
      />
      <Tab.Screen
        name={ScreenName.Notification}
        component={Notification}
        options={{
          title: t("notifications"),
          tabBarIcon: NotificationTabIcon,
        }}
      />
      <Tab.Screen
        name={ScreenName.Settings}
        component={Settings}
        options={{
          title: t("settings"),
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size - 4, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Bootstrap FCM: permissions, token, foreground listener
  useNotificationService();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {isAuthenticated ? (
        <Fragment>
          <Stack.Screen name={ScreenName.HomeTabs} component={BottomTabs} />
        </Fragment>
      ) : (
        <Fragment>
          <Stack.Screen name={ScreenName.Login} component={LoginScreen} />
          <Stack.Screen name={ScreenName.Signup} component={SignupScreen} />
        </Fragment>
      )}
    </Stack.Navigator>
  );
}

export function Navigation(props: { linking: any; onReady: () => void; theme?: any }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <KeyboardProvider>
            <NavigationContainer
              ref={navigationRef}
              linking={props.linking}
              onReady={props.onReady}
              theme={props.theme}>
              <RootNavigator />
            </NavigationContainer>
          </KeyboardProvider>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}
