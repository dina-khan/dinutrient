import React, {useContext} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

// Importing UserContext for current user state
import { UserContext } from "../contexts/UserContext";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// importing stylesheet
import { dinutrientStyles } from "../styles";

// ProfileSettings component used on the Goals screen
export default function ProfileSettings({
  // boolean which keeps track of loading, 
  // used to disable button actions during loading
  loading,

  // state variables which keep track of whether 
  // the dropdowns are in expanded view
  changePasswordExpanded,
  setChangePasswordExpanded,
  logoutExpanded,
  setLogoutExpanded,

  // state variable for new password
  newPassword,
  setNewPassword,

  // callback function for the change password button
  changePassword,

  // callback function for the signout button
  signOut,
}) {
  // storing logged in user state from UserContext
  const { user } = useContext(UserContext);

  return (
    // Profile settings card
    <View style={[dinutrientStyles.whiteContainer,
                styles.cardRow,
                styles.alignTop,
                dinutrientStyles.box]}>
      
      {/* Profile icon to left */}
      <Ionicons 
      name="person-circle-outline" 
      size={30}/>

      {/* Container taking full space to the right of profile icon */}
      <View style={dinutrientStyles.fullSpace}>

        {/* Signed in text and email */}
        <Text style={dinutrientStyles.tableValues}>Signed in</Text>
        <Text style={[dinutrientStyles.tableHeadings, styles.spaceRows]}>
          {user.email}
        </Text>

        {/* Change password dropdown */}
        <TouchableOpacity
        // Callback function which toggles the state of changePasswordExpanded
        // when the change password dropdown is pressed
        onPress={() => setChangePasswordExpanded((value) => !value)}
        style={[dinutrientStyles.flexSpaceBetween, styles.spaceRows]}>
          
          {/* Key icon and change password text */}
          <View style={dinutrientStyles.flexRow}>

            <Ionicons 
            name="key-outline" 
            size={18} 
            color="#5525beff"/>

            <Text style={dinutrientStyles.purpleText}>
              Change password
            </Text>

          </View>

          {/* Dropdown icon */}
          <Ionicons
            // Points up if the change password dropdown is expanded and down otherwise
            name={changePasswordExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color="#5525beff"/>

        </TouchableOpacity>

        {/* Conditionally rendering the change password expanded view */}
        {changePasswordExpanded && (
          
          // Change password form
          <View style={[dinutrientStyles.lightPurpleContainer, dinutrientStyles.box]}>
            
            {/* New password input */}
            <TextInput
              style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}
              placeholder="Enter password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!loading}/>

            {/* Change password button */}
            <TouchableOpacity
            onPress={changePassword}
            style={dinutrientStyles.bigPurpleButton}
            disabled={loading}>

              <Ionicons 
              name="save-outline" 
              size={20} 
              color="#fff" />

              <Text style={dinutrientStyles.secondButtonText}>
                Change Password
              </Text>

            </TouchableOpacity>
          </View>
        )}

        {/* Logout dropdown */}
        <TouchableOpacity
        // Callback function which toggles the state of logoutExpanded
        // when the logout dropdown is pressed
        onPress={() => setLogoutExpanded((value) => !value)}
        style={[dinutrientStyles.flexSpaceBetween]}>

          {/* Logout icon and text */}
          <View style={dinutrientStyles.flexRow}>

            <Ionicons 
            name="log-out-outline" 
            size={18} 
            color="#5525beff" />

            <Text style={dinutrientStyles.purpleText}>
              Logout
            </Text>

          </View>

          {/* Dropdown icon */}
          <Ionicons
          // Points up if the logout dropdown is expanded and down otherwise
          name={logoutExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#5525beff"/>

        </TouchableOpacity>
        
        {/* Conditionally rendering the logout dropdown expanded view */}
        {logoutExpanded && (
          // Card containing logout button
          <View style={[dinutrientStyles.lightRedContainer, dinutrientStyles.box]}>

            {/* Logout button */}
            <TouchableOpacity
            onPress={signOut}
            style={[dinutrientStyles.bigPurpleButton, dinutrientStyles.redButton]}>

              <Ionicons 
              name="warning-outline" 
              size={20} 
              color="#fff" />

              <Text style={dinutrientStyles.secondButtonText}>
                Logout
              </Text>

            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  alignTop:{alignItems:'flex-start'},

  spaceRows:{marginBottom:10},

  cardRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

});