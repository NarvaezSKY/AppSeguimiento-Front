import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            success: "#39A900",
            primary: "#70277a",
            warning: "#FFA500",
            danger: "#f31260",
            secondary: "#9353D3",
            info: "#00304d",
            lightblue: "#4fe5fa",
          },
        },
        dark: {
          colors: {
            success: "#39A900",
            primary: "#70277a",
            warning: "#FFA500",
            danger: "#f31260",
            secondary: "#9353D3",
            info: "#0070F0",
            lightblue: "#4fe5fa",
          },
        },
      },
    }),
  ],
};
