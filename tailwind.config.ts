import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightBg: "#F9FAFB", // untuk bg-gray-50
        darkBg: "#1A202C", // untuk bg-gray-900
        lightText: "#1F2937", // untuk text-gray-800
        darkText: "#E2E8F0", // untuk text-gray-200
      },
    },
  },
  plugins: [],
} satisfies Config;
