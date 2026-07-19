import React, { useState } from "react";
import { FlatList, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable, CategoryList, ProductCard } from "@components";
import {
  PRODUCTS,
  BorderRadius,
  Colors,
  FontFamily,
  Shadows,
  Spacing,
  Typography,
} from "@constants";
import { useAppSelector } from "@store";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectCartItemCount } from "@store/slices/cartSlice";

export function Home({ navigation }: any) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector(selectCartItemCount);

  const filteredProducts =
    selectedCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCategory);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.greetingRow}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greeting}>
            {t("heyUser", { name: user?.username || t("there") })}
          </Text>
          <Text style={styles.subGreeting}>{user?.email || t("welcomeToShopLux")}</Text>
        </View>
        <AnimatedPressable style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart" size={24} color={Colors.primary} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 99 ? "99+" : cartCount}</Text>
            </View>
          )}
        </AnimatedPressable>
      </View>
      <CategoryList selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      <Text style={styles.sectionTitle}>
        {selectedCategory === "All" ? t("featuredProducts") : t(selectedCategory.toLowerCase())}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.columnItem}>
            <ProductCard product={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
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
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.xl,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
  },
  subGreeting: {
    fontSize: Typography.sm,
    fontFamily: FontFamily.Regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative",
    ...Shadows.sm,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.badge,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontFamily: FontFamily.Bold,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  columnItem: {
    flex: 0.5,
  },
});
