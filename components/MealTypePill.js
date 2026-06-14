import React from "react";
import { TouchableOpacity, Alert, Platform, ActionSheetIOS, Text } from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

const MEAL_OPTIONS = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

// component which renders the meal type pill (e.g. breakfast, lunch)
export default function MealTypePill({ 
    // current meal type value 
    value, 
    // callback function to update meal type when it is changed from the dropdown
    onChange, 
    // this variable determins if the meal type pill should only be displayed (meals screen)
    // or also be able to update from the dropdown (recipe screen)
    readOnly = false 
}) {
    const currentLabel = MEAL_OPTIONS.find((o) => o.value === value)?.label ?? "Meal";

    // if in readOnly mode the meal type pill is simply rendered 
    if (readOnly) {
        return (
        <TouchableOpacity 
        style={[dinutrientStyles.oval, dinutrientStyles.lightPurpleContainer]} 
        disabled>

            <Ionicons 
            name="alarm" 
            size={18} 
            color = "#5525beff"/>

            <Text style={dinutrientStyles.purpleText}>
                {currentLabel.toLowerCase()}
            </Text>

        </TouchableOpacity>
        );
    }

    // This function opens a dropdown menu for meal type options
    const openSelector = () => {
        const labels = MEAL_OPTIONS.map((o) => o.label);
        const values = MEAL_OPTIONS.map((o) => o.value);

        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                options: [...labels, "Cancel"],
                cancelButtonIndex: labels.length,
                title: "Select meal type",
                },
                (idx) => {
                if (idx < labels.length) onChange(values[idx]);
                }
            );
        } 
        else {
            Alert.alert(
                "Select meal type",
                "",
                [
                ...MEAL_OPTIONS.map((o) => ({
                    text: o.label,
                    onPress: () => onChange(o.value),
                })),
                { text: "Cancel", style: "cancel" },
                ],
                { cancelable: true }
            );
        }
    };

    return (
        // rendering the meal type button when the mode is not readOnly, 
        <TouchableOpacity 
        // callback function opens meal type selection dropdown when the button is pressed
        onPress={openSelector} 
        style={[dinutrientStyles.oval, dinutrientStyles.lightPurpleContainer]}>

            <Ionicons 
            name="alarm" 
            size={18} 
            color = "#5525beff"/>

            <Text 
            style={dinutrientStyles.purpleText}>
                {currentLabel.toLowerCase()}
            </Text>

        </TouchableOpacity>
    );
}
