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
          50: "#FAF5EA",
          100: "#F3E7CE",
          200: "#E6CFA0",
          300: "#D9B87A",
          400: "#CDA968",
          500: "#C8A45D",
          600: "#AD8A47",
          700: "#8A6D38",
          800: "#664F29",
          900: "#40311A",
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
          800: "#1A1A1A",
          900: "#111111",
        },
        emerald: {
          50: "#E8F5EF",
          100: "#C5E6D6",
          400: "#1E9E6C",
          500: "#0F7A50",
          600: "#0B5E3D",
        },
        burgundy: {
          50: "#FBEEEF",
          100: "#F0D2D6",
          200: "#D89AA3",
          300: "#B96471",
          400: "#7A2E40",
          500: "#5A1E2D",
          600: "#421521",
          700: "#2E0F17",
        },
        clay: {
          50: "#FBF1EC",
          100: "#F3DDD1",
          200: "#E4B79E",
          300: "#D2926E",
          400: "#C57F5D",
          500: "#B96F50",
          600: "#995A3F",
          700: "#764531",
          800: "#523022",
          900: "#2F1B14",
        },
        beige: {
          DEFAULT: "#EFE4D2",
        },
        ivory: {
          DEFAULT: "#F8F3EA",
          dark: "#EFE4D2",
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
        gold: "0 8px 24px -8px rgba(200,164,93,0.45)",
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
