/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#fafaf8",
        panel: "#ffffff",
        panelSoft: "#f5f0eb",
        neon: "#0d7377",
        neonSoft: "#2b8a8e",
        warning: "#ffcc66",
        danger: "#ff5f73",
        success: "#35f2a1"
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["DM Sans", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 30px rgba(31,41,51,0.06)",
        glowStrong: "0 16px 40px rgba(31,41,51,0.09)"
      },
      keyframes: {
        gridShift: {
          "0%": { backgroundPosition: "0 0, 0 0" },
          "100%": { backgroundPosition: "80px 80px, 160px 160px" }
        },
        fadeRise: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: 0.45 },
          "50%": { opacity: 1 }
        }
      },
      animation: {
        gridShift: "gridShift 15s linear infinite",
        fadeRise: "fadeRise 0.45s ease-out",
        pulseLine: "pulseLine 2.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
