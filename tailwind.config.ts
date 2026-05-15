import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fdf2f6",
          100: "#fce7f0",
          200: "#f9c0d8",
          400: "#e879a8",
          600: "#c2185b",
          800: "#880e4f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
