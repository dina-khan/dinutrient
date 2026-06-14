/** START OF CODE WRITTEN taking reference from: 
 * https://supabase.com/docs/guides/auth/quickstarts/react-native
**/

// Importing React modules
import React, { createContext, useState, useEffect } from "react";

// Importing supabase connection
import { supabase } from "../supabase";

// Context for user state to be used throughout app
export const UserContext = createContext();

// Wrapper which passes UserContext to child components
export const AuthenticationWrapper = ({ children }) => {

  // state variable for current user, initialized to null (no user)
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Updating user state to logged in user
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    // Subsribing to supabasse authentication state changes 
    // and updating user state accordingly
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    // Stopping subscription
    return () => subscription.subscription.unsubscribe()
  }, []);

  return (
    // Passing user state to child components
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );

};

/** END OF CODE WRITTEN taking reference from: 
 * https://supabase.com/docs/guides/auth/quickstarts/react-native
**/