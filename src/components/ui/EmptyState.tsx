import React, { ComponentProps } from "react";
import { StatusBar, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontFamily, Spacing, Typography } from "@constants";

export interface EmptyStateProps {
  iconName: ComponentProps<typeof Ionicons>["name"];
  iconSize?: number;
  iconColor?: string;
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export function EmptyState({
  iconName,
  iconSize = 72,
  iconColor = Colors.textMuted,
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  children,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export const EmptyComponent = EmptyState;
export type EmptyComponentProps = EmptyStateProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  icon: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    lineHeight: Typography.lineHeightXl,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.base,
    lineHeight: Typography.lineHeightBase,
    fontFamily: FontFamily.Regular,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
