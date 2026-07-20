import React, { useCallback } from "react";
import { FlatList, Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@components/ui";
import { NotificationItem } from "@components/notification";
import { Colors, FontFamily, ItemSizes, Spacing, Typography } from "@constants";
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
    const itemHeight = ItemSizes.notificationItemHeight;
    const itemMargin = Spacing.sm;
    return {
      length: itemHeight + itemMargin,
      offset: (itemHeight + itemMargin) * index,
      index,
    };
  }, []);

  if (notifications.length === 0) {
    return (
      <EmptyState
        iconName="notifications-outline"
        title={t("noNotificationsTitle")}
        subtitle={t("noNotificationsSubtitle")}
      />
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
        removeClippedSubviews
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
    lineHeight: Typography.lineHeightMd,
    fontFamily: FontFamily.SemiBold,
    color: Colors.textSecondary,
  },
  markAllText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeightSm,
    fontFamily: FontFamily.SemiBold,
  },
});
