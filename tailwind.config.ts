import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark editorial palette — deliberately not a Fathom-style light SaaS.
        ink: {
          950: "#08080B",
          900: "#0D0D12",
          850: "#121218",
          800: "#17171F",
          750: "#1D1D26",
          700: "#26262F",
          600: "#34343F",
          500: "#4A4A57",
        },
        fog: {
          50: "#F6F6F9",
          100: "#E8E8EF",
          200: "#C9C9D6",
          300: "#A5A5B6",
          400: "#82828F",
          500: "#63636F",
        },
        accent: {
          DEFAULT: "#CBF24D",
          dim: "#A4C43C",
          deep: "#6E8724",
        },
        signal: {
          warm: "#FFB86B",
          hot: "#FF7A66",
          cool: "#7DD3FC",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
    },
  },
  plugins: [],
};

export default config;
