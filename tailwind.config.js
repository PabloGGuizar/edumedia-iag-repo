/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e94560', // rosa vibrante
          dark: '#c7304f',
        },
        secondary: {
          DEFAULT: '#00f5d4', // cian/turquesa
          hover: '#60fff0',
        },
        boldtext: '#b92846',
      },
    },
  },
  plugins: [],
}
