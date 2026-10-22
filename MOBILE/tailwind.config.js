/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  // Theme is chosen in the app (System / Light / Dark), so dark mode follows a class.
  darkMode: 'class',
  content: [
    "./App.{js,jsx,ts,tsx}", // ✅ Add this
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins_100Thin", "sans-serif"],
        pextralight: ["Poppins_200ExtraLight", "sans-serif"],
        plight: ["Poppins_300Light", "sans-serif"],
        pregular: ["Poppins_400Regular", "sans-serif"],
        pmedium: ["Poppins_500Medium", "sans-serif"],
        psemibold: ["Poppins_600SemiBold", "sans-serif"],
        pbold: ["Poppins_700Bold", "sans-serif"],
        pextrabold: ["Poppins_800ExtraBold", "sans-serif"],
        pblack: ["Poppins_900Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
