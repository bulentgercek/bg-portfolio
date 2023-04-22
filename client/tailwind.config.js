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
      width: {
        "sidebar-open": "var(--sidebar-open-width)",
        nav: "var(--nav-width)",
        "logo-area-open": "var(--logo-area-open-width)",
        "logo-area-close": "var(--logo-area-close-width)",
      },
      height: {
        footer: "var(--footer-height)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
