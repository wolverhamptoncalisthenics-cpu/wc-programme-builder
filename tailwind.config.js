/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF985A",
          dark: "#42403F",
          light: "#CFCFCF",
        },
      },
      fontFamily: {
        display: ["'Rethink Sans'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
