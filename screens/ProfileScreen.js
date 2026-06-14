import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";

// Importing Ionicons from expo vector-icons library
import { Ionicons } from "@expo/vector-icons";

// Importing supabase connection
import { supabase } from "../supabase";

// importing measuring tape loading animation
import TapeLoader from "../components/TapeLoader";

// importing style sheet
import { dinutrientStyles } from "../styles";

// Tap-to-dismiss-keyboard wrapper on native; passthrough on web
// (on web the TouchableWithoutFeedback steals focus from inputs)
const DismissWrapper = Platform.OS === "web"
  ? ({ children }) => <>{children}</>
  : ({ children }) => (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {children}
      </TouchableWithoutFeedback>
    );

// Profile screen component
export default function ProfileScreen() {

  // state variable to keep track of whether the screen
  // is in login or signup mode
  const [login, setLogin] = useState(true);

  // state variable for email input
  const [email, setEmail] = useState("");

  // state variable for password input
  const [password, setPassword] = useState("");

  // state variable to keep track of whether loading is taking place,
  // initialized to false
  const [loading, setLoading] = useState(false);

  // state variable to keep track of whether an otp was sent after clicking forgot password
  const [forgotPassword, setForgotPassword] = useState(false);

  // the six OTP digits, and refs to each input box
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  // This function signs up a user with the input email and password with supabase auth
  const signUp = async () => {
    if (!email || !password) return Alert.alert("Missing password/email", "Please fill both fields.");
    if (password.length < 8) return Alert.alert("Enter a minimum of 8 characters");
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: "https://dinutrient.com/confirmed" },
      });
      if (error) throw error;
      Alert.alert("Check your email", "Tap the link to verify, then come back and log in.");
    } catch (e) { Alert.alert("Error", e.message); }
    finally { setLoading(false); }
  };

  // This function signs in the user with the input email and password with supabase auth
  const signIn = async () => {
    // checking if both email/password were entered
    if (!email || !password) return Alert.alert("Missing password/email", "Please fill both fields.");
    try {
      // setting loading state to true before signing in the user
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
    catch (e) { Alert.alert("Error", e.message) }
    // setting loading state to false after sign in
    finally { setLoading(false) }
  };

  // This function uses supabase auth to send an OTP email to the user with the input email
  const sendOTP = async () => {
    // checking if an email was entered
    if (!email) return Alert.alert("Missing email", "Enter your email, and then click 'Forgot password'.");
    try {
      // setting loading state to true before sending otp email
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error) throw error;
      // setting forgotPassword to true to indicate that an otp has been sent
      setForgotPassword(true);
      // clearing the otp input boxes
      setOtp(["", "", "", "", "", ""]);
      Alert.alert("OTP email sent", "Enter OTP to sign in.");
    }
    catch (e) { Alert.alert("Error", e.message) }
    // setting loading state to false after otp email has been sent
    finally { setLoading(false) }
  };

  // This function verifies the OTP the user entered with supabase auth
  const checkOTP = async () => {
    // join the six boxes into one code
    const code = otp.join("");
    // Checking if the user filled all the otp digit inputs
    if (code.length < 6) return Alert.alert("Incomplete input", "Please fill all digits");
    try {
      // setting loading state to true before verifying otp
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (error) throw error;
      if (session) {
        // clearing states related to otp signin
        setForgotPassword(false);
        setOtp(["", "", "", "", "", ""]);
      }
    }
    catch (e) { Alert.alert("Error", e.message); }
    // setting loading state to false after otp check
    finally { setLoading(false); }
  };

  // Handle typing/pasting into an OTP box
  const handleOtpChange = (text, index) => {
    const digits = text.replace(/[^0-9]/g, "");
    if (!digits) {
      setOtp((p) => { const n = [...p]; n[index] = ""; return n; });
      return;
    }
    // Multiple digits = paste or autofill: spread them across the boxes
    if (digits.length > 1) {
      // special case: retyping over a filled box ("1" then type "5" -> "15")
      if (digits.length === 2 && otp[index] === digits[0]) {
        const d = digits[1];
        setOtp((p) => { const n = [...p]; n[index] = d; return n; });
        if (index < 5) otpRefs.current[index + 1]?.focus();
        return;
      }
      setOtp((p) => {
        const n = [...p];
        for (let k = 0; k < digits.length && index + k < 6; k++) n[index + k] = digits[k];
        return n;
      });
      otpRefs.current[Math.min(index + digits.length, 5)]?.focus();
      return;
    }
    // Single digit: set it and jump to the next box
    setOtp((p) => { const n = [...p]; n[index] = digits; return n; });
    if (index < 5) otpRefs.current[index + 1]?.focus();
  };

  // Backspace on an empty box jumps back and clears the previous one
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      setOtp((p) => { const n = [...p]; n[index - 1] = ""; return n; });
    }
  };

  return (
    <DismissWrapper>
      <SafeAreaView style={[dinutrientStyles.fullSpace, dinutrientStyles.screen]}>
        <KeyboardAvoidingView style={dinutrientStyles.fullSpace}
          behavior={Platform.select({ ios: "padding", android: undefined })}>
          <View style={dinutrientStyles.container}>

            {/* Logo on top */}
            <Image
              source={require("../assets/dinutrient.png")}
              style={dinutrientStyles.logo} />

            {/* Toggle container containing login/signup options */}
            <View style={[dinutrientStyles.flexSpaceBetween,
            dinutrientStyles.whiteContainer,
            dinutrientStyles.box,
            styles.toggle]}>
              {/* Login option */}
              <TouchableOpacity
                style={[styles.option, login && dinutrientStyles.lightPurpleContainer]}
                onPress={() => setLogin(true)}
                disabled={loading}>

                <Text style={[dinutrientStyles.tableValues, login && dinutrientStyles.tableHeadings]}>
                  Login
                </Text>

              </TouchableOpacity>

              {/* Signup option */}
              <TouchableOpacity
                style={[styles.option, !login && dinutrientStyles.lightPurpleContainer]}
                onPress={() => setLogin(false)}
                disabled={loading}>

                <Text style={[dinutrientStyles.tableValues, !login && dinutrientStyles.tableHeadings]}>
                  Signup
                </Text>

              </TouchableOpacity>
            </View>

            {/* Email input */}
            <TextInput
              style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading} />

            {/* Password input */}
            <TextInput
              style={[dinutrientStyles.whiteContainer, dinutrientStyles.box]}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading} />

            {/* Conditionally rendering forgot password button if the mode is login */}
            {login ? (
              // Forgot password button
              <TouchableOpacity
                style={[dinutrientStyles.oval, dinutrientStyles.lightPurpleContainer]}
                onPress={sendOTP}
                disabled={loading}>

                <Ionicons
                  name="help-circle-outline"
                  size={16}
                  color="#5525beff" />

                <Text style={[dinutrientStyles.purpleText]}>
                  Forgot password?
                </Text>

              </TouchableOpacity>
            ) : null}

            {/* Conditionally rendering OTP form, if forgotPassword is true i.e. OTP email has been sent */}
            {forgotPassword ? (
              // OTP form container
              <View style={[dinutrientStyles.lightPurpleContainer, dinutrientStyles.box]}>

                <Text style={dinutrientStyles.tableHeadings}>
                  Enter 6-digit code
                </Text>

                {/* OTP digit inputs container*/}
                <View style={[styles.oneTimePassword]}>

                  {/* Rendering the six OTP digit inputs from the otp array */}
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      style={[dinutrientStyles.square, dinutrientStyles.sectionHeadings, dinutrientStyles.whiteContainer, styles.digit]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, i)}
                      onKeyPress={(e) => handleOtpKeyPress(e, i)}
                      keyboardType="number-pad"
                      maxLength={6}
                      selectTextOnFocus
                      textContentType="oneTimeCode"
                      autoComplete="one-time-code"
                      editable={!loading} />
                  ))}

                </View>

                {/* OTP check and resend buttons row */}
                <View style={dinutrientStyles.flexSpaceBetween}>

                  {/* Check button */}
                  <TouchableOpacity
                    onPress={checkOTP}
                    style={[dinutrientStyles.bigPurpleButton, dinutrientStyles.fullSpace]}
                    disabled={loading}>

                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="white" />

                    <Text style={dinutrientStyles.secondButtonText}>
                      Check
                    </Text>

                  </TouchableOpacity>

                  {/* Resend button */}
                  <TouchableOpacity
                    onPress={sendOTP}
                    style={[dinutrientStyles.bigPurpleButton, dinutrientStyles.fullSpace]}
                    disabled={loading}>

                    <Ionicons
                      name="refresh-outline"
                      size={20}
                      color="white" />

                    <Text style={dinutrientStyles.secondButtonText}>
                      Resend
                    </Text>

                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {/* Login/Signup submit button */}
            <TouchableOpacity
              style={dinutrientStyles.bigPurpleButton}
              // attaching callback function based on login/signup mode
              onPress={() => login ? signIn() : signUp()}
              disabled={loading}>

              <Ionicons
                // rendering icon based on login/signup mode
                name={login ? "log-in-outline" : "person-add-outline"}
                size={20}
                color="#fff" />

              <Text style={dinutrientStyles.biggestButtonText}>
                {login ? "Log In" : "Sign Up"}
              </Text>

            </TouchableOpacity>
          </View>

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

const styles = StyleSheet.create({

  // wrapper for login/signup toggle
  toggle: {
    padding: 0,
    marginBottom: 20
  },

  // styles for login/signup option within toggle wrapper
  option: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // wraper for OTP digit inputs
  oneTimePassword: {
    justifyContent: 'space-around',
    marginVertical: 5,
    flexDirection: "row"
  },

  // style for OTP digit text
  digit: { textAlign: 'center' }

});