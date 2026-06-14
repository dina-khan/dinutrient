import React, { forwardRef } from "react";
import { View, Text,StyleSheet, Image } from "react-native";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// importing meal type pill and totals panel 
// components to display on share card
import TotalsPanel from "./TotalsPanel";
import MealTypePill from "./MealTypePill"; 
import AiDisclaimer from "./AiDisclaimer";

// ShareCard component which is used to 
// save a recipe's details as an image on the user's device
const ShareCard = forwardRef(({ 
    // recipe information
    recipe, 

    // ingredients information
    items = [], 

    // logged in user's goals
    goals }, ref) => {

    return (
        <View ref={ref} collapsable={false} style={styles.hidden}>

            <AiDisclaimer />

            {/* Recipe name and meal type pill at top */}
            <View style={dinutrientStyles.flexSpaceBetween}>

                <Text style={dinutrientStyles.title}>
                    {recipe.name}
                </Text>

                {/* Rendering the meal type pill, passing the recipe's meal type */}
                {recipe?.meal_type ? (
                    <MealTypePill value={recipe.meal_type} onChange={() => {}} readOnly />
                ) : null}

            </View>

            {/* Ingredients */}
            <View>
                <Text style={dinutrientStyles.sectionHeadings}>
                    Ingredients
                </Text>

                {/* Iterating over all ingredients, printing their name and nutrition information */}
                {items.map((it, i) => (
                    <View key={i}>
                        {/* Ingredient name and quantity */}
                        <Text style={dinutrientStyles.tableHeadings}>
                            {it.ingredient}
                            {it.quantity ? ` (${it.quantity} ${it.unit || ""})` : ""}
                        </Text>
                        {/* Ingredient nutrition information */}
                        <Text style={dinutrientStyles.smallestText}>
                            {it.calories} kcal | P {it.protein}g | C {it.carbs}g | F {it.fat}g | Fib{" "}
                            {it.fiber}g | Sug {it.sugar}g | Na {it.sodium}mg
                        </Text>
                    </View>
                    ))
                }
            </View>

            {/* Rendering totals panel with goal percentages, */}
            {/*passing the recipe total nutrient values and the user's goals */}
            <TotalsPanel
            totals={{
            calories: recipe?.total_calories ?? 0,
            protein: recipe?.total_protein ?? 0,
            carbs: recipe?.total_carbs ?? 0,
            fat: recipe?.total_fat ?? 0,
            fiber: recipe?.total_fiber ?? 0,
            sugar: recipe?.total_sugar ?? 0,
            sodium: recipe?.total_sodium ?? 0,
            }}
            goals={goals}/>

        </View>
    );
});

export default ShareCard;
   
const styles = StyleSheet.create({
    // share card container, concealed from the screen
    hidden: {
        position: "absolute",
        left: -9999,
        top: -9999,
        width: 800,
        padding: 20,
        backgroundColor: "#d4fbdaff",
        borderRadius: 16,
    },
});