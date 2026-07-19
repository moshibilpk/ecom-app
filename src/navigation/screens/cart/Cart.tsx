import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CartItemRow, GradientButton } from "@components";
import { Ionicons } from "@expo/vector-icons";
import { BorderRadius, Colors, FontFamily, Shadows, Spacing, Typography } from "@constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "./useCart";

export function CartScreen() {
  const { t } = useTranslation();
  const { items, itemCount, total, handleEmptyCart, handleCheckout } = useCart();

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <StatusBar barStyle="light-content" />
        <Ionicons
          name="cart-outline"
          size={72}
          color={Colors.textMuted}
          style={{ marginBottom: Spacing.lg }}
        />
        <Text style={styles.emptyTitle}>{t("emptyCartTitle")}</Text>
        <Text style={styles.emptySubtitle}>{t("emptyCartSubtitle")}</Text>
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
            <Text style={styles.headerTitle}>{t("itemsInCart", { count: itemCount })}</Text>
          </View>
        }
      />

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t("total")}</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.footerButtons}>
          <View style={styles.emptyButtonWrapper}>
            <GradientButton
              title={t("emptyCart")}
              onPress={handleEmptyCart}
              variant="outline"
              size="md"
            />
          </View>
          <View style={styles.checkoutButtonWrapper}>
            <GradientButton
              title={t("checkout")}
              onPress={handleCheckout}
              variant="primary"
              size="md"
            />
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
  emptyTitle: {
    fontSize: Typography.xl,
    lineHeight: Typography.lineHeightXl,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.base,
    lineHeight: Typography.lineHeightBase,
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
    lineHeight: Typography.lineHeightMd,
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
    lineHeight: Typography.lineHeightMd,
    fontFamily: FontFamily.SemiBold,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Typography.xxl,
    lineHeight: Typography.lineHeightXxl,
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
