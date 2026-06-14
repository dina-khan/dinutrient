import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// IngredientsList component which renders a list 
// of all ingredients added to a recipe on the recipe screen
export default function IngredientList({ 
    // ingredients information for the recipe
    ingredients, 

    // state of ingredient dropdown display
    expanded, 
    setExpanded, 

    // callback function for the delete ingredient button
    onDeleteIngredient 
}) {
    return (
        // Flatlist iterates over all ingredients, 
        // rendering a dropdown card for each
        <FlatList
        data={ingredients}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
            // Container card for individual ingredient
            <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}>
                {/* Container for the ingredient header*/}
                <View style={dinutrientStyles.flexRow}>
                    {/* Container for ingredient name and dropdown icon */}
                    <View style={dinutrientStyles.flexRow}>

                        {/* Dropdown icon */}
                        <TouchableOpacity
                            onPress={() =>
                            setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))}
                            style={{ paddingRight: 6 }}>
                            
                            {/* Displaying the icon pointing forward or down */} 
                            {/*based on the expanded state for the ingredient */}
                            <Ionicons
                            name={expanded[index] ? "chevron-down" : "chevron-forward"}
                            size={18}
                            color="#5525beff"/>

                        </TouchableOpacity>

                        {/* Ingredient name */}
                        <Text style={dinutrientStyles.sectionHeadings} numberOfLines={1}>
                            {item.ingredient}{item.quantity ? ` (${item.quantity} ${item.unit || ""})` : ""} - {item.calories} kcal
                        </Text>

                    </View>

                    {/* Delete ingredientbutton icon */}
                    <TouchableOpacity
                    onPress={() => onDeleteIngredient(index)}>
                        
                        <Ionicons name="trash-outline" size={20} color="red" />

                    </TouchableOpacity>
                </View>
                
                {/* If the ingredient at the current index is in expanded mode, its nutrition information is rendered */}
                {expanded[index] && (
                    <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}>
                        <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                            <Text style={dinutrientStyles.tableHeadings}>
                                Protein
                            </Text>
                            <Text style={dinutrientStyles.tableValues}>
                                {item.protein} g
                            </Text>
                        </View>
                        <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                            <Text style={dinutrientStyles.tableHeadings}>
                                Carbs
                            </Text>
                            <Text style={dinutrientStyles.tableValues}>
                                {item.carbs} g
                            </Text>
                        </View>
                        <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                            <Text style={dinutrientStyles.tableHeadings}>
                                Fat
                            </Text>
                            <Text style={dinutrientStyles.tableValues}>
                                {item.fat} g
                            </Text>
                        </View>
                        <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                            <Text style={dinutrientStyles.tableHeadings}>
                                Fiber
                            </Text>
                            <Text style={dinutrientStyles.tableValues}>
                                {item.fiber} g
                            </Text>
                        </View>
                        <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                            <Text style={dinutrientStyles.tableHeadings}>
                                Sugar
                            </Text>
                            <Text style={dinutrientStyles.tableValues}>
                                {item.sugar} g
                            </Text>
                        </View>
                        <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                            <Text style={dinutrientStyles.tableHeadings}>
                                Sodium
                            </Text>
                            <Text style={dinutrientStyles.tableValues}>
                                {item.sodium} mg
                            </Text>
                        </View>
                        <View style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}>
                            <Text style={dinutrientStyles.tableHeadings}>
                                Serving
                            </Text>

                            <Text style={dinutrientStyles.tableValues}>
                                {item.quantity} {item.unit}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
            )}
        />
    );
}