/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: "#2563EB",     // blue (trust, professional)
        secondary: "#EFF6FF",   // soft blue background
        accent: "#10B981",      // green (success / hiring)
        dark: "#111827",        // text
        muted: "#6B7280"        // secondary text
      }
    },
  },
  plugins: [],
}