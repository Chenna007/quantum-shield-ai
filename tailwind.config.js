/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        background: "#020617",
        foreground: "#e2e8f0",
        card: "#0f172a",
        "card-border": "#334155",
        accent: "#22d3ee",
        "accent-light": "#67e8f9",
        success: "#27d88f",
        warning: "#f7b643",
        danger: "#ff5d5d",
        muted: "#94a3b8",
      },
    },
  },
  plugins: [],
};
