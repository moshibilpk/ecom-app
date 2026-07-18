import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const GRADIENT_MAP: Record<string, readonly [string, string, ...string[]]> = {
  primary: Gradients.primary,
  secondary: Gradients.secondary,
  danger: Gradients.danger,
};

export function GradientButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
  size = 'md',
  icon,
}: GradientButtonProps) {
  const sizeStyle = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
    lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing.xxl },
  }[size];

  const textSize = {
    sm: Typography.sm,
    md: Typography.base,
    lg: Typography.md,
  }[size];

  const isDisabled = disabled || loading;

  if (variant === 'outline') {
    return (
      <View style={[fullWidth && styles.fullWidth, style]}>
        <Pressable
          onPress={onPress}
          disabled={isDisabled}
          style={[styles.outlineButton, sizeStyle, isDisabled && styles.disabled]}
        >
          {icon}
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={[styles.outlineText, { fontSize: textSize }]}>{title}</Text>
          )}
        </Pressable>
      </View>
    );
  }

  if (variant === 'ghost') {
    return (
      <View style={[fullWidth && styles.fullWidth, style]}>
        <Pressable
          onPress={onPress}
          disabled={isDisabled}
          style={[sizeStyle, isDisabled && styles.disabled, styles.ghostButton]}
        >
          {icon}
          {loading ? (
            <ActivityIndicator size="small" color={Colors.textSecondary} />
          ) : (
            <Text style={[styles.ghostText, { fontSize: textSize }]}>{title}</Text>
          )}
        </Pressable>
      </View>
    );
  }

  const gradientColors = GRADIENT_MAP[variant] || GRADIENT_MAP.primary;
  const shadowStyle = variant === 'danger' ? Shadows.danger : Shadows.primary;

  return (
    <View style={[fullWidth && styles.fullWidth, !isDisabled && shadowStyle, style]}>
      <Pressable onPress={onPress} disabled={isDisabled} style={styles.pressable}>
        <LinearGradient
          colors={isDisabled ? ['#3A5070', '#2A4060'] : gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, sizeStyle, styles.row]}
        >
          {icon}
          {loading ? (
            <ActivityIndicator size="small" color={Colors.textInverse} />
          ) : (
            <Text
              style={[
                styles.gradientText,
                { fontSize: textSize },
                isDisabled && styles.disabledText,
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  pressable: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  gradientText: {
    color: Colors.textInverse,
    fontWeight: Typography.bold,
    letterSpacing: 0.3,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  outlineText: {
    color: Colors.primary,
    fontWeight: Typography.semiBold,
    letterSpacing: 0.3,
  },
  ghostButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ghostText: {
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.textMuted,
  },
});
