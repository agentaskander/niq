/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F9FC",
        card: "#FFFFFF",
        ink: "#334155",
        muted: "#64748B",
        line: "#E2E8F0",
        hover: "#EEF2FF",
        blue: "#3B82F6",
        teal: "#14B8A6",
        green: "#22C55E",
        amber: "#F59E0B",
        critical: "#EF4444",
        "soft-blue": "#EFF6FF",
        "soft-teal": "#F0FDFA",
        "soft-green": "#F0FDF4",
        "soft-amber": "#FFFBEB",
        "soft-red": "#FEF2F2"
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
