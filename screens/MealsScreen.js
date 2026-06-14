// screens/MealsScreen.js
import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

// Importing supabase connection
import { supabase } from "../supabase";

// Importing UserContext for current user state
import { UserContext } from "../contexts/UserContext";

// importing GoalsContext for current goals state, goals autofill values, and goals update function
import { GoalsContext } from "../contexts/GoalsContext";

import { useIsFocused, useNavigation } from "@react-navigation/native";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// importing custom components
import TapeLoader from "../components/TapeLoader"; 
import ShareCard from "../components/ShareCard";
import MealSearchControls from "../components/MealSearchControls";
import RecipeCard from "../components/RecipeCard";
import AiDisclaimer from "../components/AiDisclaimer";

// Tap-to-dismiss-keyboard wrapper on native; passthrough on web
// (on web the TouchableWithoutFeedback steals focus from inputs)
const DismissWrapper = Platform.OS === "web"
  ? ({ children }) => <>{children}</>
  : ({ children }) => (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {children}
      </TouchableWithoutFeedback>
    );

export default function MealsScreen() {

  // storing logged in user state from UserContext
  const { user } = useContext(UserContext);

  // storing current goals state from GoalsContext
  const { goals } = useContext(GoalsContext);

  // state variable for recipes
  const [recipes, setRecipes] = useState([]);

  
  // state variable to keep track of whether loading is taking place,
  // initialized to false
  const [loading, setLoading] = useState(false);

  // state variable to keep track of whether search controls are in expanded view or not
  const [showControls, setShowControls] = useState(false);

  // state variables which keep track of whether 
  // sort and filter dropdowns are expanded or not
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // state variable for text in search box
  const [searchText, setSearchText] = useState("");

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Defining fields based on which sorting can take place
  const SORT_FIELDS = [
    { key: "created_at", label: "Date" },
    { key: "total_calories", label: "Calories" },
    { key: "total_protein", label: "Protein" },
    { key: "total_carbs", label: "Carbs" },
    { key: "total_fat", label: "Fat" },
    { key: "total_fiber", label: "Fiber" },
    { key: "total_sugar", label: "Sugar" },
    { key: "total_sodium", label: "Sodium" },
  ];

  // state variable to keep track of the sorting key, initialized to timestamp
  const [sortKey, setSortKey] = useState("created_at");

  // state variable to keep track of the sorting direction, initialized to descending
  const [sortDir, setSortDir] = useState("desc"); 

  // storing meal types
  const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

  // state variable for meal types included in filters
  const [selectedMealTypes, setSelectedMealTypes] = useState([]); 

  // state variables for date starting and ending filter
  const [dateFrom, setDateFrom] = useState(""); 
  const [dateTo, setDateTo] = useState(""); 

  // Storing all nutrients
  const NUTRIENT_ROWS = [
    { key: "total_calories", label: "Calories (kcal)" },
    { key: "total_protein", label: "Protein (g)" },
    { key: "total_carbs", label: "Carbs (g)" },
    { key: "total_fat", label: "Fat (g)" },
    { key: "total_fiber", label: "Fiber (g)" },
    { key: "total_sugar", label: "Sugar (g)" },
    { key: "total_sodium", label: "Sodium (mg)" },
  ];

  // state variable to keep track of the filter range for each nutrient
  const [nutrientRanges, setNutrientRanges] = useState(
    Object.fromEntries(NUTRIENT_ROWS.map((n) => [n.key, { min: "", max: "" }]))
  );

  // callback function to update the nutrient filter range
  const updateRange = (k, field, v) =>
    setNutrientRanges((prev) => ({
      ...prev,
      [k]: { ...prev[k], [field]: v.replace(/[^\d.]/g, "") },
    }));

  // Hidden share card state
  const shareCardRef = useRef(null);
  const [sharePayload, setSharePayload] = useState(null); // { recipe, items }

  // Media permissions for saving
  const [mediaPerm, requestMediaPerm] = MediaLibrary.usePermissions();

  const lower = (s) => (typeof s === "string" ? s.toLowerCase() : "");
  const parseDateOrNull = (s) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRecipes(data || []);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not load your recipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchRecipes();
  }, [isFocused, user]);

  const handleCreateRecipe = () => {
    navigation.navigate("Recipe", { recipeId: null });
  };
  const handleOpenRecipe = (recipe) => {
    navigation.navigate("Recipe", { recipeId: recipe.id });
  };
  const deleteRecipe = async (id) => {
    try {
      setLoading(true);
      await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);
      const { error } = await supabase.from("meals").delete().eq("id", id);
      if (error) throw error;
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not delete recipe.");
    } finally {
      setLoading(false);
    }
  };

  const shareRecipeToPhotos = async (recipeId) => {
    try {
      if (Platform.OS === "web") {
        Alert.alert("Not supported", "Saving to Photos isn’t supported on web.");
        return;
      }
      if (!mediaPerm?.granted) {
        const { status } = await requestMediaPerm();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Enable Photos permission to save.");
          return;
        }
      }
      setLoading(true);

      const { data: recipe, error: recErr } = await supabase
        .from("meals")
        .select("*")
        .eq("id", recipeId)
        .single();
      if (recErr) {
        Alert.alert("Error", recErr.message);
        setLoading(false);
        return;
      }
      const { data: items, error: itemsErr } = await supabase
        .from("recipe_ingredients")
        .select("*")
        .eq("recipe_id", recipeId);
      if (itemsErr) {
        Alert.alert("Error", itemsErr.message);
        setLoading(false);
        return;
      }

      setSharePayload({ recipe, items: items || [] });
      setTimeout(async () => {
        try {
          const uri = await captureRef(shareCardRef, {
            format: "png",
            quality: 1,
            result: "tmpfile",
            width: 1080,
          });
          await MediaLibrary.saveToLibraryAsync(uri);
          Alert.alert("Saved", "Recipe summary saved to Photos.");
        } catch (e) {
          console.error(e);
          Alert.alert("Error", "Could not save image.");
        } finally {
          setLoading(false);
          setSharePayload(null);
        }
      }, 120);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not prepare share image.");
      setLoading(false);
    }
  };

  const toggleMealType = (mt) => {
    setSelectedMealTypes((prev) =>
      prev.includes(mt) ? prev.filter((x) => x !== mt) : [...prev, mt]
    );
  };

  const clearAllFilters = () => {
    setSearchText("");
    setSelectedMealTypes([]);
    setDateFrom("");
    setDateTo("");
    setNutrientRanges(
      Object.fromEntries(NUTRIENT_ROWS.map((n) => [n.key, { min: "", max: "" }]))
    );
    setSortKey("created_at");
    setSortDir("desc");
  };

  // Derived list
  const filteredSortedRecipes = useMemo(() => {
    let arr = recipes.slice();

    // Search: by name only
    const q = lower(searchText).trim();
    if (q) {
      arr = arr.filter((r) => lower(r.name).includes(q));
    }

    // Date range
    const fromD = parseDateOrNull(dateFrom);
    const toD = parseDateOrNull(dateTo);
    if (fromD) {
      arr = arr.filter((r) => {
        const d = new Date(r.created_at);
        return !isNaN(d) && d >= fromD;
      });
    }
    if (toD) {
      const endD = new Date(toD);
      endD.setHours(23, 59, 59, 999);
      arr = arr.filter((r) => {
        const d = new Date(r.created_at);
        return !isNaN(d) && d <= endD;
      });
    }

    // Meal types
    if (selectedMealTypes.length) {
      const set = new Set(selectedMealTypes.map((x) => lower(x)));
      arr = arr.filter((r) => (r.meal_type ? set.has(lower(String(r.meal_type))) : false));
    }

    // Nutrient table filters
    for (const { key } of NUTRIENT_ROWS) {
      const minStr = nutrientRanges[key]?.min ?? "";
      const maxStr = nutrientRanges[key]?.max ?? "";
      if (minStr !== "" || maxStr !== "") {
        const min = minStr === "" ? null : Number(minStr);
        const max = maxStr === "" ? null : Number(maxStr);
        arr = arr.filter((r) => {
          const v = Number(r[key] ?? NaN);
          if (!Number.isFinite(v)) return false;
          if (min != null && v < min) return false;
          if (max != null && v > max) return false;
          return true;
        });
      }
    }

    // Sort
    arr.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "created_at") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      }
      if (!Number.isFinite(av)) av = 0;
      if (!Number.isFinite(bv)) bv = 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return arr;
  }, [recipes, searchText, dateFrom, dateTo, selectedMealTypes, nutrientRanges, sortKey, sortDir]);


  return (
    <DismissWrapper>
      <SafeAreaView style={[dinutrientStyles.fullSpace, dinutrientStyles.screen]}>
        <View style={dinutrientStyles.container}>
          {/* Share card for downloading meals (invisible) */}
          {sharePayload && (
            <ShareCard
              ref={shareCardRef}
              recipe={sharePayload.recipe}
              items={sharePayload.items}
              goals={goals}
            />
          )}

          {/* Small logo at top left of screen */}
          <Image source={require("../assets/dinutrient.png")}
            style={dinutrientStyles.logoSmall}/>

          {/* Rendering meal search controls */}
          <MealSearchControls
            searchText={searchText}
            setSearchText={setSearchText}
            showControls={showControls}
            setShowControls={setShowControls}
            showSort={showSort}
            setShowSort={setShowSort}
            sortDir={sortDir}
            setSortDir={setSortDir}
            sortKey={sortKey}
            setSortKey={setSortKey}
            SORT_FIELDS={SORT_FIELDS}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            MEAL_TYPES={MEAL_TYPES}
            selectedMealTypes={selectedMealTypes}
            toggleMealType={toggleMealType}
            nutrientRanges={nutrientRanges}
            updateRange={updateRange}
            NUTRIENT_ROWS={NUTRIENT_ROWS}
            clearAllFilters={clearAllFilters}
            onCreateRecipe={handleCreateRecipe}/>

          

          {/* Flatlist renders recipe card components for each meal*/}
          <FlatList
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          data={filteredSortedRecipes}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<AiDisclaimer />}
          renderItem={({ item }) => (
            <RecipeCard
            recipe={item}
            loading={loading}
            onOpen={() => handleOpenRecipe(item)}
            onDownload={() => shareRecipeToPhotos(item.id)}
            onDelete={() => deleteRecipe(item.id)}/>
          )}
          ListEmptyComponent={
            <View style={{ paddingVertical: 24 }}>
              <Text style={{ textAlign: "center", color: "#666", marginBottom: 8 }}>
                Click the '+' button to add your first meal
              </Text>
            </View>
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
        </View>
      </SafeAreaView>
    </DismissWrapper>
  );
}