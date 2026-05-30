import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#eef1f7",
          100: "#d4dcea",
          200: "#a9b9d5",
          400: "#5c7aaa",
          600: "#2a4a7f",
          700: "#1e3a6e",
          800: "#1B2B4B",
          900: "#111d33",
          DEFAULT: "#1B2B4B",
        },
        brand: {
          red:      "#C0392B",
          "red-dark": "#9b2d22",
          "red-light": "#fdecea",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
