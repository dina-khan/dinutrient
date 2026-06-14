import React from "react";
import { View, Text, StyleSheet } from "react-native";

// importing NutrientBar component for individual nutrient bars in the TotalsPanel
import NutrientBar from "./NutrientBar"; 

// importing stylesheet
import { dinutrientStyles } from "../styles";

// TotalsPanel component which renders colour filled bars to
// visualize the percentage of goals of each nutrient's total value in a recipe
export default function TotalsPanel({ 
    // total nutrient values for a meal
    totals,

    // the user's nutrient goal values
    goals 
}) {
    return (
        // Card container
        <View style={[dinutrientStyles.darkPurpleContainer, dinutrientStyles.box]}>

            {/* Heading */}
            <Text style={dinutrientStyles.sectionHeadings}>
                Nutrient Totals vs. Goals
            </Text>
            
            {/* Rendering a NutrientBar component for each nutrient, passing its actual value and goal value */}
            <View>
                <NutrientBar label="Calories" value={totals.calories} unit="kcal" goal={goals?.calories}/>
                <NutrientBar label="Protein" value={totals.protein} unit="g" goal={goals?.protein} />
                <NutrientBar label="Carbs" value={totals.carbs} unit="g" goal={goals?.carbs} />
                <NutrientBar label="Fat" value={totals.fat} unit="g" goal={goals?.fat} />
                <NutrientBar label="Fiber" value={totals.fiber} unit="g" goal={goals?.fiber} />
                <NutrientBar label="Sugar" value={totals.sugar} unit="g" goal={goals?.sugar} />
                <NutrientBar label="Sodium" value={totals.sodium} unit="mg" goal={goals?.sodium} />
            </View>
        </View>
    );
}