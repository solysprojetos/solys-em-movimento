import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Identidade oficial Solys — azul-marinho + dourado
        navy: {
          950: "#040c1c",
          900: "#071633",
          800: "#0a1f44",
          700: "#0e2a5e",
          600: "#123a7a",
          500: "#1b4b96",
        },
        gold: {
          300: "#e7cd8f",
          400: "#d8b45f",
          500: "#c9a24b",
          600: "#b08a35",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 30px 80px -20px rgba(2, 8, 23, 0.65)",
        gold: "0 12px 30px -8px rgba(201, 162, 75, 0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        pop: "pop 0.4s cubic-bezier(0.2,0.9,0.3,1.4) both",
      },
    },
  },
  plugins: [],
};

export default config;
