/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '890px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      animation: {
        blink: 'blink 1.2s infinite steps(1, start)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { 'background-color': 'currentColor' },
          '50%': { 'background-color': 'transparent' },
        },
      },
    },
  },
  plugins: [],
}
