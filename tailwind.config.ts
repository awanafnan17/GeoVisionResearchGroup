import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        /* ── shadcn/ui CSS variable colors ── */
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ── Modern Midnight Glass Design System Palette ── */
        midnight: {
          DEFAULT: "#060B14",
          navy: "#060B14",
          slate: "#0B1324",
          graphite: "#111C2D",
          deep: "#03070E",
        },
        graphite: {
          DEFAULT: "#111C2D",
          slate: "#111C2D",
          surface: "rgba(11, 19, 36, 0.65)",
        },
        mineral: {
          DEFAULT: "#10B981",
          emerald: "#10B981",
        },
        geological: {
          DEFAULT: "#06B6D4",
          cyan: "#06B6D4",
        },
        pyrite: {
          DEFAULT: "#F59E0B",
          amber: "#F59E0B",
        },

        /* ── Geo Vision Research Group — Core Palette & Compatibility ── */
        geo: {
          midnight: "#060B14",
          "slate-dark": "#0B1324",
          emerald: "#10B981",
          cyan: "#06B6D4",
          amber: "#F59E0B",
          navy: "#0B1320",
          "navy-light": "#111C2D",
          "navy-mid": "#18263C",
          blue: "#1D426E",
          "blue-light": "#2C5E99",
          gold: "#B8964A",
          "gold-light": "#D2B46E",
          "gold-dark": "#8F7130",
          slate: "#647080",
          "slate-light": "#9BA5B4",
          white: "#F6F3EC",
          "white-dim": "#DFDBD0",
          stone: "#F6F3EC",
          "stone-muted": "#EBE6DC",
          "stone-border": "#D6D0C4",
          ink: "#14181F",
          charcoal: "#1C222B",
        },

        /* ── GeoSentry Institutional Intelligence Palette ── */
        gs: {
          navy: "#0E1726",
          "navy-dark": "#09101B",
          "navy-section": "#132033",
          blue: "#234268",
          gold: "#B8964A",
          red: "#A93528",
          text: "#F4F1EA",
          slate: "#94A0B2",
          low: "#4E7A56",
          medium: "#B8964A",
          high: "#A93528",
          proceed: "#2D6A4F",
          nogo: "#9B2226",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "geo-grid":
          "linear-gradient(rgba(246, 243, 236, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(246, 243, 236, 0.035) 1px, transparent 1px)",
        "gs-grid":
          "linear-gradient(rgba(184, 150, 74, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 150, 74, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
