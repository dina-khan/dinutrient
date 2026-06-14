import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dinutrientStyles } from "../styles";

// Small disclaimer shown wherever AI-estimated nutrition is displayed
export default function AiDisclaimer() {
  return (
    <View style={styles.row}>
      <Ionicons name="sparkles-outline" size={13} color="#666" style={styles.icon} />
      <Text style={[dinutrientStyles.smallestText, styles.text]}>
        Nutrition values are AI-estimated and may not be exact. Not medical guidance.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    width: "100%",
    marginVertical: 6,
  },
  icon: {
    marginTop: 2,
  },
  text: {
    flex: 1,
    flexShrink: 1,
  },
});