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
      padding: {
        sm: "var(--padding-sm)",
        md: "var(--padding-md)",
      },
      spacing: {
        "logo-left-md": "var(--logo-area-left-md)",
        "logo-left-sm": "var(--logo-area-left-sm)",
        "logo-top-md": "var(--logo-area-top-md)",
        "logo-top-sm": "var(--logo-area-top-sm)",
      },
      width: {
        "sidebar-open": "var(--sidebar-open-width)",
        nav: "var(--nav-width)",
        "logo-area-open": "var(--logo-area-open-width)",
        "logo-area-close": "var(--logo-area-close-width)",
        "content-xl": "var(--content-xl)",
        "content-lg": "var(--content-lg)",
        "content-md": "var(--content-md)",
        "content-sm": "var(--content-sm)",
      },
      height: {
        logo: "var(--logo-area-height)",
        footer: "var(--footer-height)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
