import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-heading)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        gold: {
          50: "#FBF6EC",
          100: "#F5E9CB",
          200: "#EBD293",
          300: "#DFBC66",
          400: "#D4AF37",
          500: "#C29B2E",
          600: "#A17F24",
          700: "#7D621C",
          800: "#584515",
          900: "#332810",
        },
        charcoal: {
          50: "#F2F2F2",
          100: "#D9D9D9",
          200: "#B3B3B3",
          300: "#8C8C8C",
          400: "#666666",
          500: "#4A4A4A",
          600: "#333333",
          700: "#262626",
          800: "#1F1F1F",
          900: "#141414",
        },
        emerald: {
          50: "#E8F5EF",
          100: "#C5E6D6",
          400: "#1E9E6C",
          500: "#0F7A50",
          600: "#0B5E3D",
        },
        burgundy: {
          400: "#8C2F45",
          500: "#722138",
          600: "#5A192B",
        },
        ivory: {
          DEFAULT: "#FBF9F4",
          dark: "#F5F1E8",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#0F7A50",
        warning: "#B7791F",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(31,31,31,0.04), 0 1px 3px 0 rgba(31,31,31,0.06)",
        elevated: "0 4px 12px -2px rgba(31,31,31,0.08), 0 2px 6px -2px rgba(31,31,31,0.06)",
        gold: "0 8px 24px -8px rgba(212,175,55,0.45)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-in-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
