import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// component for search controls e.g. filter, sort on meals screen
export default function MealSearchControls({
  // state of text in search box
  searchText,
  setSearchText,

  // state which keeps track of whether 
  // controls form is expanded or not
  showControls,
  setShowControls,

  // state which keeps track of whether 
  // sort dropdown is expanded or not
  showSort,
  setShowSort,

  // state which keeps track of whether 
  // filters dropdown is expanded or not
  showFilters,
  setShowFilters,

  // state which keeps track of sort direction (ascending/descending)
  sortDir,
  setSortDir,

  // state which keeps track of the variable on which the sort is based
  sortKey,
  setSortKey,

  // all the sort fields
  SORT_FIELDS,

  // starting and ending date states
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,

  // all the meal type options
  MEAL_TYPES,

  // all meal types selected in filters
  selectedMealTypes,

  // callback function to switch the meal type
  toggleMealType,

  // nutrient ranges
  nutrientRanges,

  // callback function to update a nutrient range
  updateRange,

  // all nutrients
  NUTRIENT_ROWS,

  // callback function to clear all filters
  clearAllFilters,

  // callback function for the add meal button
  onCreateRecipe,
}) {
  return (
    <View>
      {/* Top row with meal search controls button, meals screen title, and add meal button*/}
      <View style={dinutrientStyles.flexSpaceBetween}>

        {/* Square button used to toggle controls view */}
        <TouchableOpacity
          style={[dinutrientStyles.square, dinutrientStyles.lightPurpleContainer]}
          onPress={() => {
            Keyboard.dismiss();
            setShowControls((s) => !s);
          }}>
          
          {/* Icon toggles between search icon and upward pointing arrow depending on showControls */}
          <Ionicons 
          name={showControls ? "chevron-up" : "search"} 
          size={18} 
          color="#5525beff" />

        </TouchableOpacity>
        
        {/* Meals screen title */}
        <Text style={dinutrientStyles.title}>Meal Plans</Text>
        
        {/* Small square button for adding a new meal */}
        <TouchableOpacity
          style={[dinutrientStyles.square, dinutrientStyles.lightPurpleContainer]}
          onPress={onCreateRecipe} >

          <Ionicons 
          name="add" 
          size={18} 
          color="#5525beff" />

        </TouchableOpacity>
      </View>

      {/* Rendering meal search controls form if showControls is in true state */}
      {showControls && (
        // card container for controls
        <View style={[dinutrientStyles.lightPurpleContainer, dinutrientStyles.box]}>
          {/* Controls clear button at top right of form */}
          <TouchableOpacity
            style={[dinutrientStyles.oval, dinutrientStyles.whiteContainer]}
            onPress={() => {
              Keyboard.dismiss();
              clearAllFilters();}}>

            <Ionicons 
            name="close-circle-outline" 
            size={18} 
            color = "#5525beff"/>

            <Text style={dinutrientStyles.purpleText}>
              Clear
            </Text>

          </TouchableOpacity>
          
          {/* Rendering search bar, filters and sort controls within a scroll view */}
          <ScrollView
          style={styles.controlsScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator>

            {/* Search bar containing search input text and search icon*/}
            <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.flexSpaceBetween, dinutrientStyles.box]}>
              
              <TextInput
              placeholder="Search meal"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"/>

              <Ionicons 
              name="search-outline" 
              size={20} 
              color="#333" />

            </View>

            {/* Toggle for sort dropdown menu */}
            {/* containing sort icon, sort text, and dropdown icon */}
            <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setShowSort((v) => !v);
            }}
            style={dinutrientStyles.flexSpaceBetween}>

              <View style={dinutrientStyles.flexRow}>
                <Ionicons 
                name="swap-vertical-outline" 
                size={16} 
                color="#5525beff" />

                <Text style={dinutrientStyles.purpleText}>
                  Sort
                </Text>
              </View>

              {/* Dropdown icon which toggles between pointing up and down based on showSort*/}
              <Ionicons
                name={showSort ? "chevron-up" : "chevron-down"}
                size={16}
                color="#5525beff"/>

            </TouchableOpacity>

            {/* Rendering the sort dropdown when showSort is true */}
            {showSort && (
              <>
                {/* Ascending/Descending button options */}
                <View style={dinutrientStyles.flexRow}>
                  {["asc", "desc"].map((dir) => (
                    <TouchableOpacity
                    key={dir}
                    style={[dinutrientStyles.smallOval, dinutrientStyles.whiteContainer, sortDir === dir && styles.pillActive]}
                    onPress={() => setSortDir(dir)}>

                      <Ionicons
                        name={dir === "asc" ? "arrow-up" : "arrow-down"}
                        size={14}
                        color={sortDir === dir ? "#fff" : "#333"}/>

                      <Text
                        style={[
                          dinutrientStyles.smallestText,
                          sortDir === dir && dinutrientStyles.smallBoldWhite,
                        ]}>
                        {dir.toUpperCase()+'ENDING'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Card container for sort fields */}
                <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}>
                  <View style={dinutrientStyles.flexRow}>
                    {/* Rendering a button for each sort field */}
                    {SORT_FIELDS.map((f) => {
                      const active = sortKey === f.key;
                      return (
                        // Sort field button
                        <TouchableOpacity
                          key={f.key}
                          style={[dinutrientStyles.smallOval, dinutrientStyles.lightPurpleContainer, active && styles.pillActive]}
                          // callback function sets sorting key to the button key
                          onPress={() => setSortKey(f.key)}>

                            {/* Sort field name */}
                            <Text style={[
                                dinutrientStyles.smallestText,
                                active && dinutrientStyles.smallBoldWhite]}>
                              {f.label}
                            </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* Filters dropdown toggle, containing filter icon, filter text, and dropdown icon */}
            <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setShowFilters((v) => !v);}}
            style={dinutrientStyles.flexSpaceBetween}>

              {/* Filter icon and filter text */}
              <View style = {dinutrientStyles.flexRow}>
                <Ionicons 
                name="filter-outline" 
                size={16} 
                color="#5525beff" />

                <Text style={dinutrientStyles.purpleText}>
                  Filters
                </Text>
              </View>

              {/* Dropdown icon which toggles between pointing up and down based on showFilters */}
              <Ionicons
                name={showFilters ? "chevron-up" : "chevron-down"}
                size={16}
                color="#5525beff"/>

            </TouchableOpacity>

            {/* Rendering filters dropdown when showFilters is true */}
            {showFilters && (
              <View style={styles.dropdownCard}>
                {/* Row containing starting and ending date text inputs */}
                <View style={dinutrientStyles.flexSpaceBetween}>
                  <TextInput
                    style={[dinutrientStyles.box, dinutrientStyles.whiteContainer, dinutrientStyles.fullSpace]}
                    placeholder="From: YYYY-MM-DD"
                    value={dateFrom}
                    onChangeText={setDateFrom}
                  />
                  <TextInput
                    style={[dinutrientStyles.box, dinutrientStyles.whiteContainer, dinutrientStyles.fullSpace]}
                    placeholder="To: YYYY-MM-DD"
                    value={dateTo}
                    onChangeText={setDateTo}
                  />
                </View>

                {/* Card container for meal type options */}
                <View style={[dinutrientStyles.flexRow, dinutrientStyles.whiteContainer, dinutrientStyles.box]}>
                  {/* rendering a button for each meal type option */}
                  {MEAL_TYPES.map((mt) => {
                    const active = selectedMealTypes.includes(mt);
                    return (
                      <TouchableOpacity
                        key={mt}
                        style={[dinutrientStyles.smallOval, dinutrientStyles.lightPurpleContainer, active && styles.pillActive]}
                        onPress={() => toggleMealType(mt)}>
                        
                        <Text style={[
                            dinutrientStyles.smallestText,
                            active && dinutrientStyles.smallBoldWhite]}>
                          {mt}
                        </Text>

                      </TouchableOpacity>
                    );})}
                </View>

                {/* Nutrients minimum/maximum filters card container */}
                <View style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}>
                  {/*  */}
                  {NUTRIENT_ROWS.map((n) => (
                    <View key={n.key} style={[dinutrientStyles.flexSpaceBetween,dinutrientStyles.nutritionRow]}>
                      {/* Nutrient name */}
                      <Text style={[dinutrientStyles.smallBoldBlack]} numberOfLines={1}>
                        {n.label}
                      </Text>
                      {/* Container for minimum and maximum text input */}
                      <View style={dinutrientStyles.flexSpaceBetween}>
                        <TextInput
                          style={[dinutrientStyles.smallNutrientInput, dinutrientStyles.smallestText, dinutrientStyles.whiteContainer]}
                          placeholder="Min"
                          value={nutrientRanges[n.key].min}
                          onChangeText={(v) => updateRange(n.key, "min", v)}/>
                        <TextInput
                          style={[dinutrientStyles.smallNutrientInput, dinutrientStyles.smallestText, dinutrientStyles.whiteContainer]}
                          placeholder="Max"
                          value={nutrientRanges[n.key].max}
                          onChangeText={(v) => updateRange(n.key, "max", v)}/>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  // setting maximum height for search controls card
  controlsScroll: { maxHeight: 450 },
  // style for selected filters etc.
  pillActive: { backgroundColor: "#5525beff"},
});
