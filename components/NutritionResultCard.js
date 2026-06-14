import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// This component displays nutrition results for a 
// food searched by image/text. 
// If the food was searched by image, it also displays the 
// image and provides a retry prediction option. 
// On the recipe screen, the nutrition results are editable and 
// it also has an add ingredient button. 
export default function NutritionResultCard({
    // image (if uploaded)
    image,

    detected,

    // nutrition result data
    result,
    // boolean which indicates if the nutrition results 
    // are in editable mode e.g. on recipe screen
    editable = false,
    // callback function for updating a field (in editable mode)
    onChangeResult, 
    // callback function for add ingredient button 
    // (optional button for recipe screen)
    onAddIngredient, 
}) {

    if (!result) return null;

    // This function renders one row from the nutrition results,
    // also differentiates between editable/noneditable rows
    const renderRow = (label, key, unit = "", numeric = false) => {
        const value = result[key] ?? "";
        if (editable) {
            return (
                <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                    <View>
                        <Text style={dinutrientStyles.tableHeadings}>
                            {label}
                        </Text>
                        {unit ? <Text style={dinutrientStyles.smallestText}>
                            {unit}
                        </Text> : null}
                    </View>
                    {/* Text input for editable nutrient value */}
                    <TextInput
                        style={[dinutrientStyles.smallNutrientInput, dinutrientStyles.whiteContainer]}
                        placeholder={label}
                        value={String(value)}
                        keyboardType={numeric ? "numeric" : "default"}
                        onChangeText={(t) => onChangeResult?.({ ...result, [key]: t })}/>
                
                </View>
            );
        } 
        else {
            return (
                <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                    <Text style={dinutrientStyles.tableHeadings}>
                        {label}
                    </Text>
                    {/* Displaying nutrient values in simple text components for non-editable version */}
                    <Text style={dinutrientStyles.tableValues}>
                        {value} {unit}
                    </Text>
                </View>
            );
        }
    };

    return (
        <View style={[dinutrientStyles.lightPurpleContainer, dinutrientStyles.box]}>
            {/* Container for image preview and retry button */}
            <View style={dinutrientStyles.flexSpaceBetween}>
                {/* Image preiew (if image is uploaded) */}
                {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            </View>
            
            {/* What the AI detected, if from an image */}
            {detected && (
                <Text style={dinutrientStyles.tableValues}>
                    Detected: {detected}
                </Text>
            )}

            {/* Rendering each row of nutrition results within this container */}
            <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}>
                {renderRow("Name", "name")}
                {renderRow("Quantity", "quantity", "", true)}
                {renderRow("Unit", "unit")}
                {renderRow("Calories", "calories", "kcal", true)}
                {renderRow("Protein", "protein", "g", true)}
                {renderRow("Carbs", "carbs", "g", true)}
                {renderRow("Fat", "fat", "g", true)}
                {renderRow("Fiber", "fiber", "g", true)}
                {renderRow("Sugar", "sugar", "g", true)}
                {renderRow("Sodium", "sodium", "mg", true)}
            </View>

            {/* Add ingredient button only in editable mode */}
            {editable && onAddIngredient && (
                <TouchableOpacity style={dinutrientStyles.bigPurpleButton} 
                onPress={onAddIngredient}>

                    <Ionicons 
                    name="add-circle" 
                    size={18} 
                    color="white" />

                    <Text style={dinutrientStyles.secondButtonText}> 
                        Add Ingredient
                    </Text>

                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // Image preview styles
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
});
