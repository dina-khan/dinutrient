import React, { useState, useEffect, useContext } from "react";
import { getNutrition, detectFoodImage } from "../services/nutrition";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from "react-native";

// Importing expo image picker for photo upload
import * as ImagePicker from "expo-image-picker";

// Importing supabase connection
import { supabase } from "../supabase";

// Importing UserContext for current user state
import { UserContext } from "../contexts/UserContext";


// importing stylesheet
import { dinutrientStyles } from "../styles";

// importing custom components
import TapeLoader from "../components/TapeLoader";
import NutritionResultCard from "../components/NutritionResultCard";
import FoodInputRow from "../components/FoodInputRow";
import RecentSearches from "../components/RecentSearches";
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

// Homescreen component
export default function HomeScreen() {

  // storing logged in user state from UserContext
  const { user } = useContext(UserContext);

  // food text input state
  const [food, setFood] = useState("");

  // nutrition result state
  const [result, setResult] = useState(null);

  // image state
  const [image, setImage] = useState(null);

  // the food name Gemini detected from the image
  const [detectedFood, setDetectedFood] = useState(null);

  // last 5 food searches state
  const [recentSearches, setRecentSearches] = useState([]);

  // state variable to keep track of whether loading is taking place,
  // initialized to false
  const [loading, setLoading] = useState(false);

  // This function requests permissions to camera and media library
  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  // This function resets states and fetches 
  // recent searches whenever the user state changes
  useEffect(() => {
    setFood("");
    setResult(null);
    setImage(null);
    setDetectedFood(null);
    fetchRecentSearches();
  }, [user]);

  // Fetch last 5 food searches
  const fetchRecentSearches = async () => {
    const { data, error } = await supabase
      .from("food_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) setRecentSearches(data);
  };

  // Clear all searches
  const clearRecentSearches = async () => {
    const { error } = await supabase.from("food_searches")
    .delete()
    .eq("user_id", user.id);
    if (!error) {
      setRecentSearches([]);
      Alert.alert("Cleared", "Your recent searches have been cleared.");
    }
  };

  // This function launches the image library for upload
  const uploadPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });

    if (!res.canceled) {
      const picked = res.assets[0];
      // updating image state
      setImage(picked.uri);
      // clearing previous result
      setResult(null);

      // Passing the uploaded image to detectFood function 
      // which uses API to detect food in the image
      detectFood(picked.base64);
    }
  };

  // This function launches the camera 
  const capturePhoto = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });

    if (!res.canceled) {
      const taken = res.assets[0];
      // updating image state
      setImage(taken.uri);
      // clearing previous result
      setResult(null);
      // Passing the uploaded image to detectFood function 
      // which uses API to detect food in the image
      detectFood(taken.base64);
    }
  };

  // This function displays an alert for the user to 
  // choose a photo upload option. 
  // It is called when the camera input is pressed.
  const showImageOptions = () => {
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Take Photo", onPress: capturePhoto },
      { text: "Upload from Gallery", onPress: uploadPhoto },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // This function calls the API 
  // to detect food in the input base64 image
  const detectFood = async (base64Image) => {
    try {
      setLoading(true);
      const concepts = await detectFoodImage(base64Image);
      if (concepts?.limitReached) {
        return Alert.alert("Daily limit reached", "You've used today's AI lookups. Please try again tomorrow.");
      }
      if (concepts.length > 0) {
        const label = concepts[0].name;
        setDetectedFood(label);
        setFood(label);
        await searchFood(label);
      } else {
        // no food found in the image
        setImage(null);
        setDetectedFood(null);
        Alert.alert("No food detected", "Couldn't find any food in that image. Try another photo.");
      }
    } catch (error) {
      console.error("detect-food error:", error);
    } finally { setLoading(false); }
  };

  // This function calls the API 
  // to fetch nutrition information for input food
  const searchFood = async (query) => {
    if (!query) return;
    setResult(null);
    try {
      setLoading(true);
      const n = await getNutrition(query);
      if (n?.limitReached) {
        return Alert.alert("Daily limit reached", "You've used today's AI lookups. Please try again tomorrow.");
      }
      if (!n) return Alert.alert("Not found", "Could not fetch nutrition info.");
      const foodData = {
        food_name: n.name,
        nf_calories: n.calories, nf_protein: n.protein,
        nf_total_carbohydrate: n.carbs, nf_total_fat: n.fat,
        nf_dietary_fiber: n.fiber, nf_sugars: n.sugar, nf_sodium: n.sodium,
        serving_qty: n.quantity, serving_unit: n.unit,
      };
      setResult(foodData);
      await supabase.from("food_searches").insert([{
        name: n.name, calories: n.calories, protein: n.protein, carbs: n.carbs,
        fat: n.fat, fiber: n.fiber, sugar: n.sugar, sodium: n.sodium,
        quantity: n.quantity, unit: n.unit, user_id: user.id,
      }]);
      fetchRecentSearches();
    } catch (error) {
      console.error("Error fetching food data:", error);
      setResult(null);
    } finally { setLoading(false); }
  };

  // Select recent item
  const handleRecentSelect = (item) => {
    setImage(null);
    setDetectedFood(null);
    setFood(item.name);
    setResult({
      food_name: item.name,
      nf_calories: item.calories,
      nf_protein: item.protein,
      nf_total_carbohydrate: item.carbs,
      nf_total_fat: item.fat,
      nf_dietary_fiber: item.fiber,
      nf_sugars: item.sugar,
      nf_sodium: item.sodium,
      serving_qty: item.quantity,
      serving_unit: item.unit,
    });
  };

  return (
    <DismissWrapper>
      <SafeAreaView style={[dinutrientStyles.fullSpace,dinutrientStyles.screen]}>
        <KeyboardAvoidingView style={dinutrientStyles.fullSpace}>
          <ScrollView contentContainerStyle={dinutrientStyles.container}>

            {/* Logo on top */}
            <Image source={require("../assets/dinutrient.png")}
              style={dinutrientStyles.logo}/>

            {/* Food input row*/}
            <FoodInputRow
              value={food}
              onChangeText={setFood}
              onSubmit={searchFood}   
              onCameraPress={showImageOptions}
              placeholder = 'Enter an food item and quantity'/>

            <AiDisclaimer />

            {/* Nutrition results card */}
            {result && (
              <NutritionResultCard
              image={image}
              detected={detectedFood}
              result={{
                name: result.food_name,
                calories: result.nf_calories,
                protein: result.nf_protein,
                carbs: result.nf_total_carbohydrate,
                fat: result.nf_total_fat,
                fiber: result.nf_dietary_fiber,
                sugar: result.nf_sugars,
                sodium: result.nf_sodium,
                quantity: result.serving_qty,
                unit: result.serving_unit,
              }}
              editable={false}/>
            )}
            {/* Recent searches card*/}
            {recentSearches.length > 0 && (
              <RecentSearches
                recentSearches={recentSearches}
                clearRecentSearches={clearRecentSearches}
                displayRecentNutrition={handleRecentSelect}
              />
            )}
            
          </ScrollView>

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
      </SafeAreaView>
    </DismissWrapper>
  );
}