import React, { Fragment } from 'react';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from '@react-navigation/elements';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store, useAppSelector } from '@store';
import { Colors, Typography } from '@constants/theme';
import { ScreenName } from '@constants/ScreenNames';
import bell from '@assets/bell.png';
import newspaper from '@assets/newspaper.png';
import { LoginScreen, SignupScreen, Home, CartScreen, Notification, Settings } from './screens';

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
      <Text style={badgeStyles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#FF5252',
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

function CartTabIcon({ color, size }: { color: string; size: number }) {
  return (
    <View>
      <Text style={{ fontSize: size - 4, color }}>🛒</Text>
      <TabBadge count={10} />
    </View>
  );
}

function NotificationTabIcon({ color, size }: { color: string; size: number }) {
  return (
    <View>
      <Image source={bell} tintColor={color} style={{ width: size, height: size }} />
      <TabBadge count={10} />
    </View>
  );
}

const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: Colors.tabActive,
  tabBarInactiveTintColor: Colors.tabInactive,
  tabBarStyle: {
    backgroundColor: Colors.tabBackground,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingBottom: 4,
    height: 60,
  },
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerTintColor: Colors.textPrimary,
  headerTitleStyle: {
    fontWeight: Typography.semiBold,
  },
};

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name={ScreenName.Home}
        component={Home}
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => (
            <Image source={newspaper} tintColor={color} style={{ width: size, height: size }} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenName.Cart}
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarIcon: CartTabIcon,
        }}
      />
      <Tab.Screen
        name={ScreenName.Notification}
        component={Notification}
        options={{
          title: 'Notifications',
          tabBarIcon: NotificationTabIcon,
        }}
      />
      <Tab.Screen
        name={ScreenName.Settings}
        component={Settings}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size - 4, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
        <NavigationContainer
          ref={navigationRef}
          linking={props.linking}
          onReady={props.onReady}
          theme={props.theme}
        >
          <RootNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
