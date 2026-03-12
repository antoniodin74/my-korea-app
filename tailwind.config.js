/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'k-blue': '#e0f2fe',
        'k-ocean': '#7dd3fc',
      },
    },
  },
  plugins: [],
}