import React from "react";
import { View, Text, StyleSheet } from "react-native";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// Component for nutrient bars used in the TotalsPanel component.
// It renders a coloured bar to visualize the percentage of goal value for a nutrient
export default function NutrientBar({ 
    // nutrient name
    label, 
    // nutrient actual value
    value, 
    // nutrient unit
    unit, 
    // goal set for nutrient
    goal, 
}) {
    // calculates the percentage of the goal
    const pct = (() => {
        if (value == null || goal == null || goal === 0) return null;
        const p = Math.round((value / goal) * 100);
        return isFinite(p) ? Math.max(0, Math.min(p, 150)) : null;
    })();

    // setting bar color according to percentage of goal
    let barColor;
    if (pct < 5 || pct > 100) barColor = "#fd8484ff"; 
    else if (pct >= 50 && pct <= 100) barColor = "#59bd50ff"; 
    else barColor = "#d6d319ff"; 

    return (
        <View style={{ width: "100%", marginBottom: 8 }}>

            {/* Container for text on top of bar */}
            <View style={dinutrientStyles.flexSpaceBetween}>
                
                {/* Printing nutrient name on top left of bar */}
                <Text style={[dinutrientStyles.tableHeadings]}>
                    {label}
                </Text>

                {/* Printing actual and percentage values on top right of bar */}
                <View style={dinutrientStyles.flexSpaceBetween}>

                    {/* Actual nutrient value */}
                    <Text style={dinutrientStyles.tableValues}>
                        {value?.toFixed ? value.toFixed(1) : value} {unit || ""}
                    </Text>

                    {/* Small oval container with percentage text */}
                    {goal ? (
                        <View style={[dinutrientStyles.smallOval, { backgroundColor: barColor }]}>
                        <Text style={dinutrientStyles.smallBoldBlack}>
                            {pct}%
                        </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* Displaying the coloured bar */}
            <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct ?? 0}%`, backgroundColor: barColor }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  barBg: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "white",
    overflow: "hidden", marginTop:2
  },
  barFill: { height: "100%" },
});
