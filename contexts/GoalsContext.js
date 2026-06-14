// contexts/GoalsContext.js

// Importing React modules
import React, { createContext, useEffect, useState, useContext } from "react";

// Importing supabase connection
import { supabase } from "../supabase";

// Importing UserContext for current user state
import { UserContext } from "./UserContext";

// Storing recommended values for goals autofill
const autofillValues = {
  /** Daily nutrition values referenced from 
   * https://www.fda.gov/
   * and 
   * https://www.heart.org/
   **/

  calories: "2000",
  protein: "75",
  carbs: "275",
  fat: "78",
  fiber: "28",
  sugar: "36",
  sodium: "2300",
};

// Goals context to be used throughout app
export const GoalsContext = createContext({
  // Initializing goals to null
  goals: null,

  // Recommended values for goals autofill
  autofillValues,

  updateGoals: async () => ({ data: null, error: null }),
});

// Wrapper which passes GoalsContext to child components
export const GoalsWrapper = ({ children }) => {

  // storing logged in user state from UserContext
  const { user } = useContext(UserContext);

  // state variable for goals, initialized to null
  const [goals, setGoals] = useState(null);

  // Function which fetches current goals from supabase
  const getGoals = async () => {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setGoals(data);
    } else {
      // No goals row yet (new user) — seed it with the autofill defaults
      const defaults = {
        calories: +autofillValues.calories,
        protein: +autofillValues.protein,
        carbs: +autofillValues.carbs,
        fat: +autofillValues.fat,
        fiber: +autofillValues.fiber,
        sugar: +autofillValues.sugar,
        sodium: +autofillValues.sodium,
      };
      const { data: seeded } = await supabase
        .from("goals")
        .upsert({ user_id: user.id, ...defaults })
        .select()
        .single();
      setGoals(seeded || defaults);
    }
  };

  // Function to set/update goals
  const updateGoals = async (inputGoals) => {
    // setting goals in supabase for the logged in user to input goals
    const { data, error } = await supabase
      .from("goals")
      .upsert({ user_id: user.id, ...inputGoals })
      .select()
      .single();

    // updating goals state
    if (!error) setGoals(data);

    return { data, error };
  };

  // Function which fetches goals from supabase and updates 
  // goals state whenever the user state changes
  useEffect(() => { 
    getGoals(); 
  }, [user]);

  return (
    // Passing goals context to child components
    <GoalsContext.Provider value={{ goals, autofillValues, updateGoals}}>
      {children}
    </GoalsContext.Provider>
  );
};
