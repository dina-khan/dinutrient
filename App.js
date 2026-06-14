// App.js
import React from "react";
import { View, StyleSheet } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { AuthenticationWrapper } from "./contexts/UserContext";
import { GoalsWrapper } from "./contexts/GoalsContext";

export default function App() {
  return (
    <AuthenticationWrapper>
      <GoalsWrapper>
        <View style={styles.appContainer}>
          <AppNavigator />
        </View>
      </GoalsWrapper>
    </AuthenticationWrapper>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1 },
});