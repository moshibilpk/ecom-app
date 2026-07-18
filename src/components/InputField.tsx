import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '@constants/theme';
import { FontFamily } from '@constants';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function InputField({
  label,
  error,
  containerStyle,
  rightIcon,
  onRightIconPress,
  value,
  onFocus,
  onBlur,
  ...rest
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderColor = error ? Colors.error : isFocused ? Colors.borderFocus : Colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, isFocused && { color: Colors.primary }]}>{label}</Text>
      ) : null}
      <View style={[styles.inputWrapper, { borderColor }]}>
        <TextInput
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
          selectionColor={Colors.primary}
          cursorColor={Colors.primary}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.base,
  },
  inputWrapper: {
    backgroundColor: Colors.glass,
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.Medium,
    marginBottom: Spacing.xs,
    marginStart: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontFamily: FontFamily.Regular,
    paddingVertical: 0,
    height: '100%',
  },
  rightIcon: {
    marginStart: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.xs,
    fontFamily: FontFamily.Medium,
    marginTop: Spacing.xs,
    marginStart: Spacing.sm,
  },
});
