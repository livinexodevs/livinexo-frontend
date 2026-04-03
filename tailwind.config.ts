import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        haveli: {
          50: "#fdf8f0",
          100: "#faecd9",
          200: "#f4d5b0",
          300: "#ecb87d",
          400: "#e39548",
          500: "#db7b2a",
          600: "#c4611f",
          700: "#a3491c",
          800: "#843b1e",
          900: "#6c321b",
          950: "#3a180c",
        },
        sand: {
          50: "#faf9f6",
          100: "#f2f0ea",
          200: "#e5e0d4",
          300: "#d3cab7",
          400: "#bfb196",
          500: "#b09e7f",
          600: "#a38d6f",
          700: "#88755e",
          800: "#6f6050",
          900: "#5b4f43",
          950: "#302922",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(8px)", opacity: "0.4" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "scroll-hint": "scroll-hint 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
