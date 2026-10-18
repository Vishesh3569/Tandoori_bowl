import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // catches any nested subfolders
  ],
  theme: {
    extend: {
      colors: {
        tandoori: {
          red: "#D90429",
          "red-dark": "#8D0801",
          "red-deep": "#4A0404",
          yellow: "#FFB703",
          "yellow-accent": "#FB8500",
          cream: "#FFFDF0",
          dark: "#0F0F11",
          charcoal: "#1A1A1E",
          card: "#16161A",
          border: "#2A2A30",
        },
      },
      boxShadow: {
        "glow-red": "0 0 25px -5px rgba(217, 4, 41, 0.4)",
        "glow-yellow": "0 0 25px -5px rgba(255, 183, 3, 0.35)",
        "3d-pop": "0 25px 35px -10px rgba(0, 0, 0, 0.75)",
      },
    },
  },
  plugins: [],
};

export default config;