import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CATEGORIES, BorderRadius, Colors, FontFamily, Spacing, Typography } from "@constants";
import { AnimatedPressable } from "@components/ui";

// ─── Single chip ─────────────────────────────────────────────────────────────
function CategoryChip({
  cat,
  isSelected,
  onPress,
}: {
  cat: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  return (
    <AnimatedPressable
      onPress={onPress}
      scaleValue={0.97}
      enableScale={true}
      enableOpacity={false}
      style={styles.chipWrapper}>
      <View style={isSelected ? styles.chipActive : styles.chipInactive}>
        <Text style={isSelected ? styles.chipActiveText : styles.chipInactiveText}>
          {t(cat.toLowerCase())}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

// ─── Category List ────────────────────────────────────────────────────────────
interface CategoryListProps {
  selectedCategory: string;
  onSelect: (cat: string) => void;
}

export function CategoryList({ selectedCategory, onSelect }: CategoryListProps) {
  const renderChip = useCallback(
    ({ item: cat }: { item: string }) => (
      <CategoryChip cat={cat} isSelected={selectedCategory === cat} onPress={() => onSelect(cat)} />
    ),
    [selectedCategory, onSelect],
  );

  return (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item}
      renderItem={renderChip}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  chipWrapper: {
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  chipActive: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  chipActiveText: {
    color: Colors.textInverse,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Bold,
    lineHeight: Typography.lineHeightSm,
  },
  chipInactive: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipInactiveText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Medium,
    lineHeight: Typography.lineHeightSm,
  },
});
