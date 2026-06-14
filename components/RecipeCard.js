import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// importing MealTypePill component to display on top right of recipe card
import MealTypePill from "./MealTypePill";

// RecipeCard component which is used to represent 
// individual meals on the meals screen
export default function RecipeCard({ 
    // recipe information
    recipe, 

    // callback function for open button,
    // opens the meal's recipe screen
    onOpen, 

    // callback function for download button, 
    // saves the meal share card to device
    onDownload, 

    // callback function for delete button, 
    // deletes the meal from supabase table
    onDelete,
}) {
    const formatTimestamp = (ts) => {
        try {
            const d = new Date(ts);
            if (isNaN(d.getTime())) return "";
            return d.toLocaleString();
        } 
        catch {return ""}
    };

    return (
        // Meal card container
        <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}>

            {/* Meal header containing name, timestamp, and meal type pill */}
            <View style={[dinutrientStyles.flexRow, styles.mealHeader]}>

                {/* Container for meal name and timestamp */}
                <View style={dinutrientStyles.fullSpace}>
                    
                    <Text style={dinutrientStyles.sectionHeadings} numberOfLines={1}>
                        {recipe.name}
                    </Text>

                    <Text style={dinutrientStyles.smallestText}>
                        {formatTimestamp(recipe.created_at)}
                    </Text>

                </View>

                {/* Displaying the meal type in read only mode */}
                {recipe.meal_type ? (
                    <MealTypePill value={recipe.meal_type} readOnly />
                ) : null}

            </View>

            {/* Displaying nutrition information */}
            <Text style={[dinutrientStyles.tableValues, styles.mealNutrition]}>
                {recipe.total_calories?.toFixed(1)} kcal | Protein: {recipe.total_protein?.toFixed(1)}g | 
                Carbs: {recipe.total_carbs?.toFixed(1)}g | Fat: {recipe.total_fat?.toFixed(1)}g | 
                Fiber: {recipe.total_fiber?.toFixed(1)}g | Sugar: {recipe.total_sugar?.toFixed(1)}g | 
                Sodium: {Math.round(recipe.total_sodium)}mg
            </Text>

            {/* Row of buttons: open, download, delete */}
            <View style={dinutrientStyles.flexRow}>
                {/* Open button */}
                <TouchableOpacity 
                onPress={onOpen} 
                style={[dinutrientStyles.flexRow, styles.actionBtn, dinutrientStyles.greenBorderBtn]}>

                    <Ionicons name="open-outline" size={15} color="#2e7d32" />

                    <Text style={dinutrientStyles.smallBoldBlack}>
                        Open
                    </Text>

                </TouchableOpacity>

                {/* Download button */}
                <TouchableOpacity
                onPress={onDownload}
                style={[dinutrientStyles.whiteContainer, dinutrientStyles.flexRow, styles.actionBtn, dinutrientStyles.blueBorderBtn]}>

                    <Ionicons name="download-outline" size={15} color="#1976d2" />
                    <Text style={dinutrientStyles.smallBoldBlack}>
                        Download
                    </Text>

                </TouchableOpacity>

                {/* Delete button */}
                <TouchableOpacity
                onPress={onDelete}
                style={[dinutrientStyles.whiteContainer, dinutrientStyles.flexRow, styles.actionBtn,  dinutrientStyles.redBorderBtn]}>
                    
                    <Ionicons name="trash-outline" size={15} color="#c62828" />
                    
                    <Text style={dinutrientStyles.smallBoldBlack}>
                        Delete
                    </Text>

                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // styles for open, download and delete buttons
    actionBtn: {
        borderWidth: 2, 
        padding:4, 
        justifyContent:'center', 
        borderRadius:10
    },
    // giving space below the meal header and meal nutrition information
    mealHeader: {marginBottom: 10},
    mealNutrition: {marginBottom: 8}
});
