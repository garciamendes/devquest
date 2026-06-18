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
        ink: {
          900: "#0B0E13",
          800: "#11151D",
          700: "#171C26",
          600: "#1F2632",
          500: "#2A323F",
        },
        line: "#27303D",
        fog: {
          DEFAULT: "#E8EAED",
          dim: "#9AA4B2",
          faint: "#5E6878",
        },
        java: {
          DEFAULT: "#F89820",
          deep: "#E76F00",
        },
        go: {
          DEFAULT: "#00ADD8",
          deep: "#0089A8",
        },
        ember: "#FF6B4A",
        leaf: "#4ADE80",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(248,152,32,0.25), 0 8px 30px -8px rgba(248,152,32,0.35)",
        "glow-go": "0 0 0 1px rgba(0,173,216,0.25), 0 8px 30px -8px rgba(0,173,216,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -16px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "flame": {
          "0%,100%": { transform: "scale(1) rotate(-2deg)" },
          "50%": { transform: "scale(1.12) rotate(2deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "pop": "pop 0.35s ease-out both",
        "flame": "flame 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
