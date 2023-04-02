/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      screens: {
        xs: "414px",
        ss: "600px",
        sm: "768px",
        md: "1024px",
        lg: "1280px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
