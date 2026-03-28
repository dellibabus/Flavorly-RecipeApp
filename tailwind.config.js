/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#2D9CDB',
        accent: '#F2C94C',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
