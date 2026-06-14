import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dinutrientStyles } from "../styles";

// component for food input row, with a text search and photo upload option
export default function FoodInputRow({
    // current value of food input
    value,

    // callback function for when food input value changes
    onChangeText,

    // callback function for when the text input is submitted
    onSubmit,

    // callback function for when the camera icon is pressed
    onCameraPress,
    placeholder = '',
}) {
  return (
    <View style={dinutrientStyles.flexRow}>
        {/* Text input search */}
        <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.flexRow, dinutrientStyles.box]}>
            <TextInput
            style = {dinutrientStyles.fullSpace}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={() => onSubmit?.(value)}/>

            {/* Search icon */}
            <TouchableOpacity 
            onPress={() => onSubmit?.(value)}>

                <Ionicons 
                name="search-outline" 
                size={20} color="black" />

            </TouchableOpacity>

        </View>
        
        {/* Camera button */}
        <TouchableOpacity
        style={[dinutrientStyles.square, dinutrientStyles.lightPurpleContainer]}
        onPress={onCameraPress}>

            <Ionicons 
            name="camera-outline" 
            size={20} 
            color="#5525beff" />

        </TouchableOpacity>
    </View>
    
    
  );
}