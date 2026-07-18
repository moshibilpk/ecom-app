import React from "react";
import { Alert, FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { CartItemRow, GradientButton } from "@components";
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from "@constants";
import { useAppDispatch, useAppSelector } from "@store";
import {
  emptyCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
} from "@store/slices/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export function CartScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);

  const handleEmptyCart = () => {
    Alert.alert("Empty Cart", "Are you sure you want to remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Empty Cart",
        style: "destructive",
        onPress: () => dispatch(emptyCart()),
      },
    ]);
  };

  const handleCheckout = () => {
    Alert.alert(
      "🎉 Order Placed!",
      `Your order of ${itemCount} item(s) worth $${total.toFixed(2)} has been placed successfully!`,
      [{ text: "Great!", onPress: () => dispatch(emptyCart()) }],
    );
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Browse products and add items to get started</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{itemCount} item(s) in cart</Text>
          </View>
        }
      />

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.footerButtons}>
          <View style={styles.emptyButtonWrapper}>
            <GradientButton
              title="Empty Cart"
              onPress={handleEmptyCart}
              variant="outline"
              size="md"
            />
          </View>
          <View style={styles.checkoutButtonWrapper}>
            <GradientButton title="Checkout" onPress={handleCheckout} variant="primary" size="md" />
          </View>
        </View>
      </View>
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
    paddingBottom: 200,
  },
  headerRow: {
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.md,
    fontFamily: FontFamily.SemiBold,
    color: Colors.textSecondary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl,
    borderTopStartRadius: BorderRadius.xl,
    borderTopEndRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.base,
  },
  totalLabel: {
    fontSize: Typography.md,
    fontFamily: FontFamily.SemiBold,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Typography.xxl,
    fontFamily: FontFamily.Bold,
    color: Colors.primary,
  },
  footerButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  emptyButtonWrapper: {
    flex: 1,
  },
  checkoutButtonWrapper: {
    flex: 1,
  },
});
