import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// Mapping of goal form keys and their corresponding displayed names
const goalFields = [
    ["calories", "Calories (kcal)"],
    ["protein", "Protein (g)"],
    ["carbs", "Carbs (g)"],
    ["fat", "Fat (g)"],
    ["fiber", "Fiber (g)"],
    ["sugar", "Sugar (g)"],
    ["sodium", "Sodium (mg)"],
];

// Component for goals form
export default function GoalsForm({
    // current state of goals form fields
    form,
    // function to update state of goals form fields
    setForm,
    // boolean which keeps track of loading, 
    // used to disable button actions during loading
    loading,
    // callback function for save goals button
    saveGoals,
    // callback function for autofill button
    autofill,

}) {
  return (
    <>
        {/* Form container */}
        <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}>

            {/* Container for form title and autofill button */}
            <View style={dinutrientStyles.flexSpaceBetween}>

                <Text style={dinutrientStyles.sectionHeadings}>
                    Daily Goals
                </Text>

                {/* Autofill button */}
                <TouchableOpacity
                style={[dinutrientStyles.oval, dinutrientStyles.lightPurpleContainer]}
                onPress={autofill}
                disabled={loading}>

                    <Ionicons 
                    name="color-wand" 
                    size={18} 
                    color = "#5525beff"/>

                    <Text style={dinutrientStyles.purpleText}>
                        Autofill
                    </Text>

                </TouchableOpacity>
            </View>

            {/* Mapping over each goals form key and name, rendering rows for each goal. */}
            {goalFields.map(([key, name]) => (
                // Row containing goal name and input value
                <View 
                style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}
                key={key} >
                    
                    {/* Goal name */}
                    <Text style={dinutrientStyles.tableHeadings}>
                        {name}
                    </Text>

                    {/* Goal value */}
                    <TextInput
                    style={[dinutrientStyles.whiteContainer, dinutrientStyles.box, dinutrientStyles.tableValues, dinutrientStyles.smallNutrientInput]}
                    keyboardType="numeric"
                    placeholder={name}
                    value={form[key]}
                    // callback function to update the form state when an input value changes
                    onChangeText={(value) => setForm((prev) => ({ ...prev, [key]: value }))}
                    editable={!loading}/>

                </View>
            ))}

            {/* Save goals button */}
            <TouchableOpacity
            onPress={saveGoals}
            style={dinutrientStyles.bigPurpleButton}
            disabled={loading}>

                <Ionicons 
                name="save-outline" 
                size={20} 
                color="#fff" />

                <Text style={dinutrientStyles.biggestButtonText}>
                    Save Goals
                </Text>

            </TouchableOpacity>
        </View>

        {/* Disclaimer for goals autofill */}
        <View>
            <Ionicons 
            name="information-circle-outline" 
            size={15}
            color = "#666"/> 

            <Text style={dinutrientStyles.smallestText}>
                Autofill loads general daily values based on a 2000 kcal diet.
                Adjust to your needs. These are not medical guidance. 
            </Text>
        </View>
    </>
  );
}