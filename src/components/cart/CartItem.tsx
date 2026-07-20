import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BorderRadius, Colors, FontFamily, Spacing, Typography } from "@constants";
import { CartItem as CartItemType } from "@models";
import { useAppDispatch } from "@store";
import { decrementQuantity, incrementQuantity, removeFromCart } from "@store/slices/cartSlice";
import { AnimatedPressable } from "@components/ui";

interface CartItemProps {
  item: CartItemType;
}

export function CartItemRow({ item }: CartItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    dispatch(incrementQuantity(item.product.id));
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity(item.product.id));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.product.title}
        </Text>
        <Text style={styles.price}>${(item.product.price * item.quantity).toFixed(2)}</Text>
        <Text style={styles.unitPrice}>
          ${item.product.price.toFixed(2)} {t("each")}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleDecrement} style={styles.qtyButton}>
          <Text style={styles.qtyButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleIncrement} style={styles.qtyButton}>
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <AnimatedPressable
        scaleValue={0.7}
        onPress={() => dispatch(removeFromCart(item.product.id))}
        style={styles.removeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.removeText}>✕</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  info: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeightSm,
    fontFamily: FontFamily.SemiBold,
    marginBottom: 2,
  },
  price: {
    color: Colors.primary,
    fontSize: Typography.base,
    lineHeight: Typography.lineHeightBase,
    fontFamily: FontFamily.Bold,
  },
  unitPrice: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    lineHeight: Typography.lineHeightXs,
    fontFamily: FontFamily.Regular,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  qtyButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: Colors.primary,
    fontSize: Typography.md,
    lineHeight: Typography.lineHeightMd,
    fontFamily: FontFamily.Bold,
  },
  quantity: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeightSm,
    fontFamily: FontFamily.Bold,
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    marginStart: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 82, 82, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: Colors.error,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FontFamily.Bold,
  },
});
