/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F8FB",
        card: "#FFFFFF",
        ink: "#0F172A",
        muted: "#64748B",
        line: "#DDE5EF",
        hover: "#EEF2FF",
        blue: "#2563EB",
        teal: "#0D9488",
        green: "#16A34A",
        amber: "#D97706",
        critical: "#DC2626",
        "soft-blue": "#DBEAFE",
        "soft-teal": "#CCFBF1",
        "soft-green": "#DCFCE7",
        "soft-amber": "#FEF3C7",
        "soft-red": "#FEE2E2"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
        lift: "0 10px 24px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
