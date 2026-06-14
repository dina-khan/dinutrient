// navigation/AppNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// Importing UserContext for current user state
import { UserContext } from "../contexts/UserContext";

// Importing screen components for navigation
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RecipeScreen from "../screens/RecipeScreen";
import MealsScreen from "../screens/MealsScreen";
import GoalsScreen from "../screens/GoalsScreen";

// Creating a tab and a stack navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// The tab navigator will have tabs for Home, Meals, and Goals
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // hiding header on tab screens
        headerShown: false,
        // setting icons for tab screens
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Meals") iconName = "book";
          else if (route.name === "Goals") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#d4fbdaff",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          backgroundColor: "black",
          height: 70,
        },
        contentStyle: { backgroundColor: "#d4fbdaff" }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Meals" component={MealsScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
    </Tab.Navigator>
  );
}

// The Recipe screen can be navigated to from the tab screens
export default function AppNavigator() {
  // storing logged in user state from UserContext
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{contentStyle: { backgroundColor: "#d4fbdaff" }}}>
        {/* If a user is logged in, the main tab screens are shown */}
        {user ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Recipe"
              component={RecipeScreen}
              options={{
                title: "Recipe Details",
                headerBackTitle: "Back",
              }}
            />
          </>
        ) : (
          // If a user is not logged in, the Profile screen is shown for authentication
          <Stack.Screen
            name="Auth"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
