# Dinutrient 🥗
### AI-Powered Nutritional Meal Planner - Cross-Platform Mobile App

A React Native (Expo) nutrition app that turns a **food name or photo** into detailed nutrition data, lets users build **recipe-style meal plans**, and tracks everything against **personalised daily goals**. Originally built as the final project for **CM3050 Mobile Development**, BSc (Hons) Computer Science, University of London (Goldsmiths), and since rebuilt with an AI backend and a secure, publish-ready architecture.

> 📌 This repository is shared for **portfolio and evaluation purposes**. Dinutrient is being prepared for commercial release, so backend configuration and setup steps are intentionally omitted. See the License below.

---

## 🔗 Links

- 📺 **Demo Video:** `https://youtu.be/Ncuim6wPx5k`
- 🌐 **Live Web Demo:** `https://dinutrient.netlify.app/`

---

## ✨ Features

- **Natural-language food lookup** - type "2 boiled eggs and a slice of toast" and get total nutrition; an LLM parses the amount and estimates the values.
- **Food photo recognition** - snap or upload a photo and the app identifies the food (and rough quantity) and fills in nutrition automatically.
- **Recipe builder** - add ingredients by text or photo; nutrition is fetched and totalled, with each ingredient editable.
- **Meal plans** - save, search, sort, and filter meals by calories, macros, meal type, and date range.
- **Personalised goals** - set or autofill daily targets; each meal is shown as a percentage of goals via colour-coded bars.
- **Shareable summary cards** - export a meal's nutrition as an image to the device.
- **Full auth** - email/password sign-up with email confirmation, one-time-password reset, and password change.

## 🏗️ Architecture Highlights

- **Reusable component design** - a shared food-input and nutrition-results component drives both the home lookup and the recipe builder, avoiding duplicated logic across screens.
- **Global state via React Context** for the authenticated user and their goals.
- **Secrets stay server-side** - all AI API keys live in serverless **Supabase Edge Functions**, never in the client bundle. The app calls the functions; the functions hold the keys.
- **Row-Level Security** - every table is RLS-protected so each user can only access their own data.
- **Structured AI output** - Gemini is called with a response schema so nutrition data comes back as clean, typed JSON rather than free text.

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo (SDK 54) |
| Language | JavaScript |
| Navigation | React Navigation (bottom tabs + native stack) |
| Backend / DB / Auth | Supabase (PostgreSQL + Auth) |
| Serverless | Supabase Edge Functions (Deno / TypeScript) |
| AI | Google Gemini 2.5 Flash (nutrition estimation + food image recognition, via structured output) |
| Email | Resend (SMTP for auth emails) |
| Image capture | expo-image-picker, react-native-view-shot, expo-media-library |

---

## 📁 Project Structure

```
dinutrient/
├── App.js
├── supabase.js
├── assets/
├── components/        # FoodInputRow, NutritionResultCard, IngredientList, etc.
├── contexts/          # UserContext, GoalsContext
├── navigation/        # AppNavigator
├── screens/           # Home, Profile, Recipe, Meals, Goals
├── services/          # Edge Function calls
└── styles.js
```

---

## 📝 Notes

Nutrition values are AI-estimated and intended as a guide, not medical or dietary advice.

## 📄 License

**Copyright © 2026 Dina Khan. All rights reserved.**

This source code is made publicly visible for portfolio and evaluation purposes only. No permission is granted to copy, modify, distribute, or reuse this code, in whole or in part, for any purpose without the express written permission of the copyright holder. See [LICENSE](LICENSE).
