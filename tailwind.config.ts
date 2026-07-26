import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF9",
        ink: "#18181B",
        steel: "#71717A",
        steelLight: "#A1A1AA",
        amber: "#D97706",
        amberSoft: "#FEF3E2",
        teal: "#059669",
        rust: "#DC2626",
        line: "#E7E5E4",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
