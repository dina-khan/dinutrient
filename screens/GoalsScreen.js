import React, { 
  useContext, 
  useState, 
  useEffect } from "react";

import { 
  SafeAreaView, 
  ScrollView, 
  Alert, 
  View, 
  Image } from "react-native";

// importing GoalsContext for current goals state, 
// goals autofill values, and goals update function
import { GoalsContext } from "../contexts/GoalsContext";

// importing supabase connection
import { supabase } from "../supabase";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// importing custom components
import TapeLoader from "../components/TapeLoader";
import ProfileSettings from "../components/ProfileSettings";
import GoalsForm from "../components/GoalsForm";

// Goals screen component
export default function GoalsScreen() {
  // storing current goals state, goals autofill values, 
  // and goals update function from GoalsContext
  const { goals, updateGoals, autofillValues } = useContext(GoalsContext);

  // state variable object for goals form values, 
  // initialized to empty strings
  const [form, setForm] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
  });

  // state variable to keep track of whether loading is taking place,
  // initialized to false
  const [loading, setLoading] = useState(false);

  // state variable to keep track of whether the change password dropdown menu
  // has been expanded or not, initialized to false
  const [changePasswordExpanded, setChangePasswordExpanded] = useState(false);

  // state variable to store the new password
  const [newPassword, setNewPassword] = useState("");

  // state variable to keep track of whether the logout dropdown menu
  // has been expanded or not, initialized to false
  const [logoutExpanded, setLogoutExpanded] = useState(false);

  // This function updates the goals form state whenever the goals state changes
  useEffect(() => {
    if (goals) {
      setForm({
        calories: String(goals.calories),
        protein: String(goals.protein),
        carbs: String(goals.carbs),
        fat: String(goals.fat),
        fiber: String(goals.fiber),
        sugar: String(goals.sugar),
        sodium: String(goals.sodium),
      });
    }
  }, [goals]);

  // This function saves the form goal values to supabase
  const saveGoals = async () => {
    try {
      // setting loading state to true before goals update
      setLoading(true);
      // updateGoals function from GoalsContext saves input values to supabase goals
      const { error } = await updateGoals({
        calories: +form.calories,
        protein: +form.protein,
        carbs: +form.carbs,
        fat: +form.fat,
        fiber: +form.fiber,
        sugar: +form.sugar,
        sodium: +form.sodium,
      });
      if (error) Alert.alert("Error", error.message);
      else Alert.alert("Success", "Your goals have been updated.");
    } 
    catch (e) {Alert.alert("Error", e.message)} 
    // setting loading state to false after goals have been updated
    finally {setLoading(false)}
  };


  // This function signs out the current user in supabase auth
  const signOut = async () => {
    try {
      // setting loading state to true before signing out
      setLoading(true);
      await supabase.auth.signOut();
    } 
    catch (e) {Alert.alert("Error", e.message)} 
    // setting loading state to false after sign out is completed
    finally {setLoading(false)}
  };

  // This function updates the password for the current user in supabase auth to newPassword
  const changePassword = async () => {
    // Alerting the user if the password is missing or incomplete
    if (!newPassword) return Alert.alert("Missing password");
    if (newPassword.length < 8) return Alert.alert("Enter a minimum of 8 characters");
    try {
      // setting loading state to true before changing password
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      Alert.alert("Success", "Your password has been updated");
      // updating changePasswordExpanded state to false, 
      // to close the change password expanded view
      setChangePasswordExpanded(false);
    } 
    catch (e) {Alert.alert("Error", e.message)} 
    // setting loading state to false after password change
    finally {setLoading(false)}
  };

  // This function sets the form goal values to the autofill values from GoalsContext
  const autofill = () => {setForm(autofillValues)};

  return (
    <SafeAreaView style={[dinutrientStyles.fullSpace,dinutrientStyles.screen]}>
      {/* Scrolling container for goals screen */}
      <ScrollView contentContainerStyle={dinutrientStyles.container}>

        {/* Logo at top left */}
        <Image 
        source={require("../assets/dinutrient.png")}
        style={dinutrientStyles.logoSmall}/>

        {/* Profile settings card component at the top */}
        <ProfileSettings
          loading={loading}
          changePasswordExpanded={changePasswordExpanded}
          setChangePasswordExpanded={setChangePasswordExpanded}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          changePassword={changePassword}
          logoutExpanded={logoutExpanded}
          setLogoutExpanded={setLogoutExpanded}
          signOut={signOut}/>

        {/* Daily nutrition goals form */}
        <GoalsForm
          form={form}
          setForm={setForm}
          loading={loading}
          saveGoals={saveGoals}
          autofill={autofill}/>

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
    </SafeAreaView>
  );
}
