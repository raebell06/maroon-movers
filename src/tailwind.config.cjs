/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#f7eef0',
          100: '#efdce1',
          300: '#c98a92',
          500: '#800000',
          700: '#660000'
        }
      }
    }
  },
  plugins: []
}
