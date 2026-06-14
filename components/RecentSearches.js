import React from "react";
import { View, Text, TouchableOpacity} from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// Component to display recent food searches on the home screen
export default function RecentSearches({ 
    // recently searched foods
    recentSearches, 

    // Callback function for the clear button
    clearRecentSearches, 

    // Callback function for when a recently searched food is pressed.
    // The selected food's nutrition is displayed above
    displayRecentNutrition 
}) {
    if (!recentSearches || recentSearches.length === 0) return null;
    
    return (
        //  Container for recent searches card
        <View style={[dinutrientStyles.darkPurpleContainer, dinutrientStyles.box]}>
            {/* Container for recent searches heading and clear button */}
            <View style={dinutrientStyles.flexSpaceBetween}>

                <Text style={dinutrientStyles.sectionHeadings}>
                    Search History
                </Text>

                {/* Clear button */}
                <TouchableOpacity 
                style={[dinutrientStyles.oval, dinutrientStyles.lightPurpleContainer]} 
                onPress={clearRecentSearches}>
                    
                    <Ionicons 
                    name="close-circle-outline" 
                    size={18} 
                    color = "#5525beff"/>

                    <Text style={dinutrientStyles.purpleText}>
                        Clear
                    </Text>

                </TouchableOpacity>
            </View>

            {/* Mapping over recentSearches, displaying a row for each */}
            {recentSearches.map((search, i) => (
                // Container for recently searched food row
                <TouchableOpacity
                key={i}
                style={[dinutrientStyles.flexSpaceBetween, dinutrientStyles.nutritionRow]}
                onPress={() => displayRecentNutrition(search)}>
                
                    {/* Container for the recently searched food name and quantity */}
                    <View>
                        <Text style={dinutrientStyles.tableHeadings}>
                            {search.name}
                        </Text>

                        <Text style={dinutrientStyles.tableValues}>
                            {search.quantity} {search.unit}
                        </Text>
                    </View>
                    
                    {/* Displaying calories to the right */}
                    <Text style={dinutrientStyles.tableValues}>
                        {search.calories} kcal
                    </Text>

                </TouchableOpacity>
            ))}
        </View>
  );
}
