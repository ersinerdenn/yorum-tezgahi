import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F3FF",
        ink: "#3B2A5C",
        steel: "#8B7FA8",
        steelLight: "#B0A8C7",
        amber: "#7C3AED",
        amberSoft: "#F3E8FF",
        teal: "#059669",
        rust: "#DC2626",
        line: "#EAE3F7",
      },
      fontFamily: { display: ["Inter", "sans-serif"], body: ["Inter", "sans-serif"], mono: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
