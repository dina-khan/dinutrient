import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Importing expo image picker for photo upload
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import { captureRef } from "react-native-view-shot";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// Importing supabase connection
import { supabase } from "../supabase";

// Importing UserContext for current user state
import { UserContext } from "../contexts/UserContext";

// importing GoalsContext for current goals state, goals autofill values, and goals update function
import { GoalsContext } from "../contexts/GoalsContext";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// importing custom components
import TapeLoader from "../components/TapeLoader"; 
import NutritionResultCard from "../components/NutritionResultCard";
import FoodInputRow from "../components/FoodInputRow";
import ShareCard from "../components/ShareCard";
import IngredientList from "../components/IngredientList";
import TotalsPanel from "../components/TotalsPanel";
import MealTypePill from "../components/MealTypePill";
import { getNutrition, detectFoodImage } from "../services/nutrition";
import AiDisclaimer from "../components/AiDisclaimer";

// Recipe screen component
export default function RecipeScreen({ navigation, route }) {
  // storing logged in user state from UserContext
  const { user } = useContext(UserContext);
  // storing current goals state from GoalsContext
  const { goals } = useContext(GoalsContext);

  // storing recipe id from route parameters
  const recipeId = route?.params?.recipeId;

  // meal type state
  const [mealType, setMealType] = useState("dinner");

  // recipe name state
  const [recipeName, setRecipeName] = useState("");

  // state of current ingredient 
  const [ingredient, setIngredient] = useState("");

  // previously added ingredients state
  const [ingredients, setIngredients] = useState([]);

  // state to keep track of whether an ingredient 
  // from the list is in expanded view or not
  const [expanded, setExpanded] = useState({});

  // state of recipe total nutrients
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  });

  // state of form manual input
  const [manualData, setManualData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
    quantity: "",
    unit: "",
  });

  // preview image state
  const [previewImage, setPreviewImage] = useState(null);

  const [detectedFood, setDetectedFood] = useState(null);

  const shareCardRef = useRef(null);

  const [mediaPerm, requestMediaPerm] = MediaLibrary.usePermissions();

  // state variable to keep track of whether loading is taking place,
  // initialized to false
  const [loading, setLoading] = useState(false);

  // loading a recipe into the form if a recipe id is provided,
  // otherwise displaying a blank form
  useEffect(() => {
    if (recipeId) loadRecipe(recipeId);
    else resetForm();
  }, [recipeId]);

  // This function loads the recipe with input id from supabase
  const loadRecipe = async (id) => {
    try {
      // updating loading state to true before loading recipe
      setLoading(true);
      
      // fetching recipe from supabase 'meals' table
      const { data: recipe } = await supabase
        .from("meals")
        .select("*")
        .eq("id", id)
        .single();
      if (!recipe) return;

      // fetching recipe ingredients from supabase 'recipe_ingredients' table
      const { data: items } = await supabase
        .from("recipe_ingredients")
        .select("*")
        .eq("recipe_id", id);

      // updating form states to the fetched recipe data
      setRecipeName(recipe.name);
      setMealType(recipe.meal_type || "dinner");
      setIngredients(items || []);
      setTotals({
        calories: recipe.total_calories || 0,
        protein: recipe.total_protein || 0,
        carbs: recipe.total_carbs || 0,
        fat: recipe.total_fat || 0,
        fiber: recipe.total_fiber || 0,
        sugar: recipe.total_sugar || 0,
        sodium: recipe.total_sodium || 0,
      });
    } 
    // Updating loading state to false after loading recipe
    finally {setLoading(false);}
  };

  // This function resets form states when the reset button is pressed
  const resetForm = () => {
    setRecipeName("");
    setIngredient("");
    setIngredients([]);
    setExpanded({});
    setTotals({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium_mg: 0,
    });
    setManualData({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      sugar: "",
      sodium: "",
      quantity: "",
      unit: "",
    });
    resetImageState();
    navigation.setParams?.({ recipeId: null });
  };

  // This function clears image state
  const resetImageState = () => {
    setPreviewImage(null);
    setDetectedFood(null);
  };

  // This function recalculates total nutrients when an ingredient is added
  const recalcTotals = (list) => {
    const sum = list.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fat: acc.fat + (item.fat || 0),
        fiber: acc.fiber + (item.fiber || 0),
        sugar: acc.sugar + (item.sugar || 0),
        sodium_mg: acc.sodium_mg + (item.sodium_mg || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium_mg: 0 }
    );
    // updating totals state
    setTotals(sum);
  };

  // This function calls the API 
  // to fetch nutrition information for input food
  const searchFood = async (query) => {
    try {
      setLoading(true);
      const n = await getNutrition(query);
      if (n?.limitReached) {
        return Alert.alert("Daily limit reached", "You've used today's AI lookups. Please try again tomorrow.");
      }
      if (!n) return Alert.alert("Not found", "Could not fetch nutrition info.");
      setManualData({
        name: n.name,
        calories: String(n.calories), protein: String(n.protein),
        carbs: String(n.carbs), fat: String(n.fat), fiber: String(n.fiber),
        sugar: String(n.sugar), sodium: String(n.sodium),
        quantity: String(n.quantity), unit: n.unit,
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch nutrition info.");
    } finally { setLoading(false); }
  };

  // This function adds an ingredient to the form ingredients
  const addIngredient = () => {
    if (!manualData.name || !manualData.calories) return Alert.alert("Error", "Please enter at least a name and calories.");
    
    const item = {
      ingredient: manualData.name,
      calories: parseFloat(manualData.calories) || 0,
      protein: parseFloat(manualData.protein) || 0,
      carbs: parseFloat(manualData.carbs) || 0,
      fat: parseFloat(manualData.fat) || 0,
      fiber: parseFloat(manualData.fiber) || 0,
      sugar: parseFloat(manualData.sugar) || 0,
      sodium: parseFloat(manualData.sodium) || 0,
      quantity: parseFloat(manualData.quantity) || null,
      unit: manualData.unit || "",
    };
    const updated = [...ingredients, item];
    // updating states, recalculating totals
    setIngredients(updated);
    recalcTotals(updated);
    setIngredient("");
    setManualData({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      sugar: "",
      sodium: "",
      quantity: "",
      unit: "",
    });
    resetImageState();
  };

  // This function delets the ingredient with input index from the form
  const deleteIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
    recalcTotals(updated);
  };

  // This function displays an alert for the user to 
  // choose a photo upload option. 
  // It is called when the camera input is pressed.
  const showImageOptions = () => {
    Alert.alert("Add Ingredient Photo", "Choose an option", [
      { text: "Upload Photo", onPress: uploadPhoto },
      { text: "Capture Photo", onPress: capturePhoto },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // This function launches the image library for upload
  const uploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const picked = result.assets[0];
      // updating image state
      setPreviewImage(picked.uri);
      // Passing the uploaded image to detectFood function 
      // which uses API to detect food in the image
      detectFood(picked.base64);
    }
  };

  // This function launches the camera 
  const capturePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const taken = result.assets[0];
      // updating image state
      setPreviewImage(taken.uri);
      // Passing the uploaded image to detectFood function 
      // which uses API to detect food in the image
      detectFood(taken.base64);
    }
  };

  // This function calls the API 
  // to detect food in the input base64 image
  const detectFood = async (img) => {
    try {
      setLoading(true);
      const conceptsData = await detectFoodImage(img);
      if (conceptsData?.limitReached) {
        return Alert.alert("Daily limit reached", "You've used today's AI lookups. Please try again tomorrow.");
      }
      if (conceptsData.length > 0) {
        const label = conceptsData[0].name;
        setDetectedFood(label);
        setIngredient(label);
        await searchFood(label);
      } else {
        // no food found in the image
        resetImageState();
        Alert.alert("No food detected", "Couldn't find any food in that image. Try another photo.");
      }
    } catch (error) {
      console.error("detect-food error:", error);
    } finally { setLoading(false); }
  };

  // This function saves the recipe to supabase
  const saveRecipe = async () => {
    if (!recipeName || ingredients.length === 0) return Alert.alert("Error", "Add a name and at least one ingredient.");
    
    // updating loading state to true before saving recipe
    setLoading(true);
    try {
      let recipe;
      // If the recipe already exists in the database, 
      // updating the 'meals' and 'recipe_ingredients' table 
      if (recipeId) {
        const { data, error } = await supabase
          .from("meals")
          .update({
            name: recipeName,
            total_calories: totals.calories,
            total_protein: totals.protein,
            total_carbs: totals.carbs,
            total_fat: totals.fat,
            total_fiber: totals.fiber,
            total_sugar: totals.sugar,
            total_sodium: totals.sodium_mg,
            meal_type: mealType,
          })
          .eq("id", recipeId)
          .select()
          .single();
        if (error) throw error;
        recipe = data;

        await supabase.from("recipe_ingredients").delete().eq("recipe_id", recipeId);
        const recipeItems = ingredients.map((item) => ({
          recipe_id: recipe.id,
          ingredient: item.ingredient,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber,
          sugar: item.sugar,
          sodium: item.sodium,
          quantity: item.quantity,
          unit: item.unit,
        }));
        await supabase.from("recipe_ingredients").insert(recipeItems);
      } 
      // if this is a new recipe, inserting into the 'meals' and 
      // 'recipe_ingredients' table
      else {
        const { data: newRecipe, error } = await supabase
          .from("meals")
          .insert([
            {
              user_id: user.id,
              name: recipeName,
              total_calories: totals.calories,
              total_protein: totals.protein,
              total_carbs: totals.carbs,
              total_fat: totals.fat,
              total_fiber: totals.fiber,
              total_sugar: totals.sugar,
              total_sodium: totals.sodium_mg,
              meal_type: mealType,
            },
          ])
          .select()
          .single();
        if (error) throw error;
        recipe = newRecipe;

        const recipeItems = ingredients.map((item) => ({
          recipe_id: recipe.id,
          ingredient: item.ingredient,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber,
          sugar: item.sugar,
          sodium: item.sodium,
          quantity: item.quantity,
          unit: item.unit,
        }));
        await supabase.from("recipe_ingredients").insert(recipeItems);
      }

      Alert.alert("Success", "Recipe saved!");
    } 
    catch (e) {Alert.alert("Error", "Could not save recipe.")}
    // updating loading state to false after the recipe has been saved
    finally {setLoading(false)}
  };

  // This function deletes the recipe from supabase
  const deleteRecipeForever = async () => {
    if (!recipeId) return;

    Alert.alert("Delete Recipe", "This will permanently delete the recipe.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await supabase.from("recipe_ingredients")
            .delete()
            .eq("recipe_id", recipeId);

            const { error } = await supabase.from("meals")
            .delete()
            .eq("id", recipeId);

            if (error) throw error;

            Alert.alert("Deleted", "Recipe removed.");
            navigation.goBack?.();
          } 
          catch (e) {
            console.error(e);
            Alert.alert("Error", "Could not delete recipe.");
          } 
          // updating loading state to false after the recipe has been deleted
          finally {setLoading(false);}
        },
      },
    ]);
  };

  // This function saves the recipe summary to photos
  const saveToPhotos = async () => {
    try {
      // informing the user that photo can not be saved on web
      if (Platform.OS === "web") {
        Alert.alert("Sorry", "Image cannot be saved.");
        return;
      }
      // informing the user that permission is required to save photo
      if (!mediaPerm?.granted) {
        const { status } = await requestMediaPerm();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Enable Photos permission to save.");
          return;
        }
      }
      // updating loading state to true before saving recipe photo
      setLoading(true);

      // storing the share card component as an image
      const uri = await captureRef(shareCardRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
        width: 1080,
      });

      // saving the share card to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      Alert.alert("Saved", "Recipe summary saved to Photos.");
    } 
    catch (e) {Alert.alert("Error", "Could not save image.");} 
    // updating loading state to false after saving recipe summary to photos
    finally {setLoading(false);}
  };

  return (
    <KeyboardAvoidingView style={dinutrientStyles.fullSpace} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Recipe summary share card (hidden for photos download) */}
      <ShareCard
        ref={shareCardRef}
        recipe={{
          name: recipeName,
          meal_type: mealType,
          total_calories: totals.calories,
          total_protein: totals.protein,
          total_carbs: totals.carbs,
          total_fat: totals.fat,
          total_fiber: totals.fiber,
          total_sugar: totals.sugar,
          total_sodium: totals.sodium_mg,
        }}
        items={ingredients}
        goals={goals}/>

      <FlatList
      data={ingredients}
      keyExtractor={(_, idx) => idx.toString()}
      contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <>
          {/* Title + meal type pill */}
          <View style={dinutrientStyles.flexRow}>
            <TextInput
              style={[dinutrientStyles.flexRow,dinutrientStyles.whiteContainer, dinutrientStyles.title, dinutrientStyles.box]}
              placeholder="Recipe name"
              value={recipeName}
              onChangeText={setRecipeName}
            />
            <MealTypePill value={mealType} onChange={setMealType} />
          </View>

          {/* Ingredient input row */}
          <FoodInputRow
            value={ingredient}
            onChangeText={(t) => {
              setIngredient(t);
              resetImageState();
            }}
            onSubmit={searchFood}
            onCameraPress={showImageOptions}
            placeholder = 'Enter an ingredient and quantity'/>

          

          {/* Nutrition card for current input */}
          <NutritionResultCard
          image={previewImage}
          detected={detectedFood}
          result={manualData.name ? manualData : null}
          editable={true}
          onChangeResult={setManualData}
          onAddIngredient={addIngredient}/>
          </>
        }
        renderItem={null} 
        ListFooterComponent={
          <>
            {/* Rendering ingrediedents list component for previously added ingredients */}
            <IngredientList
              ingredients={ingredients}
              expanded={expanded}
              setExpanded={setExpanded}
              onDeleteIngredient={deleteIngredient}/>

            {/* Rendering totals component if ingredients are present */}
            {ingredients.length > 0 && <TotalsPanel totals={totals} goals={goals} />}
            <AiDisclaimer />

            {/* Bottom row for buttons: save, download, reset, delete */}
            <View style={[styles.bottomBar, dinutrientStyles.flexSpaceBetween]}>

              {/* Save button */}
              <TouchableOpacity
              onPress={saveRecipe}
              style={[styles.bottomBtn, dinutrientStyles.greenBorderBtn]}>

                <Ionicons name="share" size={30} color="#59bd50ff" />

                <Text style={dinutrientStyles.smallBoldBlack}>
                  Save
                </Text>

              </TouchableOpacity>
              {/* Download button */}
              <TouchableOpacity
                onPress={saveToPhotos}
                style={[styles.bottomBtn, dinutrientStyles.blueBorderBtn]}>

                <Ionicons name="download-outline" size={30} color="#65a9f3ff" />

                <Text style={dinutrientStyles.smallBoldBlack}>
                  Download
                </Text>

              </TouchableOpacity>

              {/* Reset button */}
              <TouchableOpacity
              onPress={resetForm}
              style={[styles.bottomBtn, dinutrientStyles.yellowBorderBtn]}>

                <Ionicons name="refresh-outline" size={30} color="#c0bd07ff" />

                <Text style={dinutrientStyles.smallBoldBlack}>
                  Reset
                </Text>

              </TouchableOpacity>

              {/* Delete button rendered conditionally if the recipe is old */}
              {recipeId ? (
                <TouchableOpacity
                onPress={deleteRecipeForever}
                style={[styles.bottomBtn, dinutrientStyles.redBorderBtn]}>

                  <Ionicons name="trash-outline" size={30} color="#fd8484ff" />

                  <Text style={dinutrientStyles.smallBoldBlack}>
                    Delete
                  </Text>

                </TouchableOpacity>
              ) : null}
            </View>
          </>
        }
      />

      {/* Conditionally rendering the measuring tape loading animation when loading state is true*/}
      {loading && (
        // Container for animation to appear topmost and centered 
        <View style={dinutrientStyles.tapeAnimationContainer} 
        pointerEvents="none">
          {/* Rendering measuring tape animation component */}
          <TapeLoader />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // styling bottom row of buttons
  bottomBar: {
    gap: 8,
    marginTop: 14,
    paddingTop: 8,
  },
  // styling individual buttons at bottom
  bottomBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
  },
});
