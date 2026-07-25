import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EEF0EF", ink: "#1B1E23", steel: "#3D4552",
        steelLight: "#8993A1", amber: "#E8A23D", teal: "#2F8F82",
        rust: "#C1512F", line: "#D6D9D3",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
