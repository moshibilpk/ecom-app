import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, FontFamily, Typography } from "@constants";

export function Notification() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notification Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  text: {
    fontFamily: FontFamily.Medium,
    fontSize: Typography.lg,
    color: Colors.textPrimary,
  },
});
