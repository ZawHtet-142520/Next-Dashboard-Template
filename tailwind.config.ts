import type { Config } from "tailwindcss";

import tailwindScrollbar from "tailwind-scrollbar";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbar],
};

export default config;
