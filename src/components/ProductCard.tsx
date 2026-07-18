import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from "@constants";
import { Product } from "@models";
import { useAppDispatch, useAppSelector } from "@store";
import { addToCart, decrementQuantity, incrementQuantity } from "@store/slices/cartSlice";
import { AnimatedPressable } from "./AnimatedPressable";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector(
    (state) => state.cart.items.find((i) => i.product.id === product.id)?.quantity || 0,
  );
  const isInCart = quantity > 0;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${product.price.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {product.description}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviewCount})</Text>
        </View>
        {isInCart ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => dispatch(decrementQuantity(product.id))}
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => dispatch(incrementQuantity(product.id))}
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <AnimatedPressable onPress={handleAddToCart} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add to Cart</Text>
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    margin: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    backgroundColor: Colors.surfaceElevated,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceBadge: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  priceText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Bold,
  },
  info: {
    padding: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontFamily: FontFamily.SemiBold,
    marginBottom: 2,
  },
  description: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontFamily: FontFamily.Regular,
    marginBottom: Spacing.sm,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: 2,
  },
  star: {
    fontSize: 12,
  },
  rating: {
    color: Colors.secondary,
    fontSize: Typography.xs,
    fontFamily: FontFamily.SemiBold,
  },
  reviews: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontFamily: FontFamily.Regular,
  },
  addButton: {
    backgroundColor: "rgba(0, 212, 170, 0.12)",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  addButtonText: {
    color: Colors.primary,
    fontSize: Typography.xs,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.3,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 212, 170, 0.08)",
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: BorderRadius.sm,
    height: 40,
    paddingHorizontal: Spacing.xs,
  },
  quantityButton: {
    paddingHorizontal: Spacing.base,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  quantityButtonText: {
    color: Colors.primary,
    fontSize: Typography.md,
    fontFamily: FontFamily.Bold,
  },
  quantityText: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Bold,
  },
});
