import { supabase } from "../supabase";

// Fetch nutrition for a food description via the get-nutrition Edge Function.
// Returns the nutrition object, null on error, or { limitReached: true } if the
// user has hit their daily AI limit.
export async function getNutrition(query) {
  if (!query) return null;
  const { data, error } = await supabase.functions.invoke("get-nutrition", { body: { query } });
  if (error) {
    if (error.context?.status === 429) return { limitReached: true };
    console.error("getNutrition error:", error);
    return null;
  }
  return data;
}

// Detect food(s) from a base64 image via the detect-food Edge Function.
// Returns an array of { name } options, an empty array on error, or
// { limitReached: true } if the user has hit their daily AI limit.
export async function detectFoodImage(base64) {
  const { data, error } = await supabase.functions.invoke("detect-food", { body: { image: base64 } });
  if (error) {
    if (error.context?.status === 429) return { limitReached: true };
    console.error("detectFood error:", error);
    return [];
  }
  return data?.concepts || [];
}