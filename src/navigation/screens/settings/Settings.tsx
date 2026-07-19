import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedPressable, GradientButton } from "@components";
import {
  BorderRadius,
  Colors,
  FontFamily,
  Gradients,
  Shadows,
  Spacing,
  Typography,
} from "@constants";
import { useSettings } from "./useSettings";

export function Settings() {
  const {
    t,
    user,
    userInitials,
    currentLanguageName,
    onLogout,
    handleSendTestNotification,
    onSelectLanguage,
  } = useSettings();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <StatusBar barStyle="light-content" />
        <View style={styles.userCard}>
          <LinearGradient colors={Gradients.card} style={styles.userCardGradient}>
            <LinearGradient colors={Gradients.primary} style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </LinearGradient>
            <Text style={styles.userName}>{user?.username || "User"}</Text>
            <Text style={styles.userEmail}>{user?.email || "Not signed in"}</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("generalSettings")}</Text>
          <AnimatedPressable style={styles.settingRow} onPress={onSelectLanguage}>
            <Ionicons
              name="globe-outline"
              size={22}
              color={Colors.primary}
              style={{ marginEnd: Spacing.md }}
            />
            <Text style={styles.settingLabel}>{t("language")}</Text>
            <Text style={styles.chevronValue}>{currentLanguageName}</Text>
            <Text style={styles.chevron}> › </Text>
          </AnimatedPressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("developerTools")}</Text>
          <GradientButton
            icon={<Ionicons name="notifications-outline" size={20} color={Colors.textInverse} />}
            title={t("sendTestNotification")}
            onPress={handleSendTestNotification}
            variant="secondary"
            size="md"
          />
        </View>

        <View style={styles.logoutContainer}>
          <GradientButton title={t("logout")} onPress={onLogout} variant="danger" size="md" />
        </View>
        <Text style={styles.version}>{t("version")} ShopLux v1.0.0</Text>
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
  settingLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.base,
    lineHeight: Typography.lineHeightBase,
    fontFamily: FontFamily.Medium,
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: Typography.lg,
    fontFamily: FontFamily.Regular,
    lineHeight: Typography.lineHeightBase,
  },
  chevronValue: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeightBase,
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
