import React, { useCallback } from "react";
import { FlatList, Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NotificationItem } from "@components";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontFamily, Spacing, Typography } from "@constants";
import { useAppDispatch, useAppSelector } from "@store";
import {
  markAllAsRead,
  selectNotifications,
  selectUnreadCount,
} from "@store/slices/notificationSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export function Notification() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);

  const renderItem = useCallback(({ item }: { item: (typeof notifications)[number] }) => {
    return <NotificationItem notification={item} />;
  }, []);

  const getItemLayout = useCallback((_: unknown, index: number) => {
    const itemHeight = 94;
    const itemMargin = 8;
    return {
      length: itemHeight + itemMargin,
      offset: (itemHeight + itemMargin) * index,
      index,
    };
  }, []);

  if (notifications.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <StatusBar barStyle="light-content" />
        <Ionicons
          name="notifications-outline"
          size={72}
          color={Colors.textMuted}
          style={{ marginBottom: Spacing.lg }}
        />
        <Text style={styles.emptyTitle}>{t("noNotificationsTitle")}</Text>
        <Text style={styles.emptySubtitle}>{t("noNotificationsSubtitle")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
        getItemLayout={getItemLayout}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {unreadCount > 0 ? t("unreadCount", { count: unreadCount }) : t("allCaughtUp")}
            </Text>
            {unreadCount > 0 && (
              <Pressable onPress={() => dispatch(markAllAsRead())}>
                <Text style={styles.markAllText}>{t("markAllRead")}</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.base,
    fontFamily: FontFamily.Regular,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: Spacing.base,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.md,
    fontFamily: FontFamily.SemiBold,
    color: Colors.textSecondary,
  },
  markAllText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontFamily: FontFamily.SemiBold,
  },
});
