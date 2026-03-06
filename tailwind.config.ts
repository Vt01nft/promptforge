import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#07070d",
          secondary: "#0e0e18",
          tertiary: "#151522",
          hover: "#1a1a2e",
        },
        accent: {
          green: "#00d4aa",
          red: "#ff4757",
          blue: "#5b7fff",
          purple: "#a78bfa",
          yellow: "#fbbf24",
        },
        text: {
          primary: "#e4e4e7",
          secondary: "#71717a",
          muted: "#3f3f50",
        },
        border: {
          DEFAULT: "#1e1e2e",
          hover: "#2e2e42",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Geist Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "typewriter": "typewriter 2s steps(40) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 170, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 212, 170, 0.2)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
