/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
