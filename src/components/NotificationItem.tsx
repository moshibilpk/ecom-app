import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BorderRadius, Colors, FontFamily, Spacing, Typography } from "@constants";
import { Notification } from "@models";
import { useAppDispatch } from "@store";
import { markAsRead } from "@store/slices/notificationSlice";

interface NotificationItemProps {
  notification: Notification;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TYPE_ICONS: Record<string, string> = {
  order: "📦",
  promo: "🎁",
  system: "🔔",
};

export const NotificationItem = React.memo(function NotificationItem({
  notification,
}: NotificationItemProps) {
  const dispatch = useAppDispatch();

  const handlePress = () => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, !notification.read && styles.unreadContainer]}>
      {/* Unread indicator */}
      {!notification.read && <View style={styles.unreadDot} />}

      {/* Icon */}
      <View style={[styles.iconCircle, !notification.read && styles.iconCircleUnread]}>
        <Text style={styles.iconText}>{TYPE_ICONS[notification.type || "system"]}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, !notification.read && styles.titleUnread]} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.timestamp}>{formatTimeAgo(notification.timestamp)}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative",
    height: 94,
  },
  unreadContainer: {
    borderStartWidth: 3,
    borderStartColor: Colors.primary,
    backgroundColor: "rgba(0, 212, 170, 0.05)",
  },
  unreadDot: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircleUnread: {
    backgroundColor: "rgba(0, 212, 170, 0.1)",
    borderColor: "rgba(0, 212, 170, 0.3)",
  },
  iconText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingEnd: Spacing.lg,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Medium,
    marginBottom: 2,
  },
  titleUnread: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.Bold,
  },
  body: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontFamily: FontFamily.Regular,
    lineHeight: Typography.lineHeightXs,
    marginBottom: Spacing.xs,
  },
  timestamp: {
    color: Colors.textMuted,
    fontSize: 10,
    fontFamily: FontFamily.Medium,
  },
});
