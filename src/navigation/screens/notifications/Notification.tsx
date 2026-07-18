import React from "react";
import { FlatList, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { NotificationItem } from "@components";
import { Colors, Spacing, Typography } from "@constants";
import { useAppDispatch, useAppSelector } from "@store";
import {
  markAllAsRead,
  selectNotifications,
  selectUnreadCount,
} from "@store/slices/notificationSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export function Notification() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);

  if (notifications.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.emptyIcon}>🔔</Text>
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptySubtitle}>
          {"You'll be notified about orders, deals, and more"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </Text>
            {unreadCount > 0 && (
              <Pressable onPress={() => dispatch(markAllAsRead())}>
                <Text style={styles.markAllText}>Mark all read</Text>
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.base,
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
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  markAllText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
  },
});
