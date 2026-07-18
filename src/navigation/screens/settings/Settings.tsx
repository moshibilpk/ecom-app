import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "@components";
import { auth } from "@config/firebase";
import {
  BorderRadius,
  Colors,
  FontFamily,
  Gradients,
  Shadows,
  Spacing,
  Typography,
} from "@constants";
import { useAppDispatch, useAppSelector } from "@store";
import { clearUser } from "@store/slices/authSlice";
import { emptyCart } from "@store/slices/cartSlice";

export function Settings() {
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

  const handleLogout = () => {
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
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <StatusBar barStyle="light-content" />
        <View style={styles.userCard}>
          <LinearGradient colors={Gradients.card} style={styles.userCardGradient}>
            <LinearGradient colors={Gradients.primary} style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.username ? getInitials(user.username) : "?"}
              </Text>
            </LinearGradient>
            <Text style={styles.userName}>{user?.username || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email || "Not signed in"}</Text>
          </LinearGradient>
        </View>
        <View style={styles.logoutContainer}>
          <GradientButton title="Logout" onPress={handleLogout} variant="danger" size="md" />
        </View>
        <Text style={styles.version}>ShopLux v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: Spacing.giant,
  },
  userCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  userCardGradient: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    ...Shadows.primary,
  },
  avatarText: {
    color: Colors.textInverse,
    fontSize: Typography.xl,
    fontFamily: FontFamily.Bold,
  },
  userName: {
    fontSize: Typography.lg,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.sm,
    fontFamily: FontFamily.Regular,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontFamily: FontFamily.Bold,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
    marginStart: Spacing.xs,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingIcon: {
    fontSize: 20,
    marginEnd: Spacing.md,
  },
  settingLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontFamily: FontFamily.Medium,
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: Typography.lg,
    fontFamily: FontFamily.Regular,
  },
  chevronValue: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Regular,
  },
  logoutContainer: {
    marginTop: Spacing.md,
    ...Shadows.danger,
  },
  version: {
    textAlign: "center",
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontFamily: FontFamily.Regular,
    marginTop: Spacing.xl,
  },
});
