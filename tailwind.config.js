/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#172554',
          blue: '#2563EB',
          green: '#16A34A',
          purple: '#7C3AED',
          bg: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular'],
      }
    },
  },
  plugins: [],
}
