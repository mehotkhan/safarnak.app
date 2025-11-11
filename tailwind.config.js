/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './ui/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#0077be',
        danger: '#ef4444',
        success: '#10b981',
        neutral: {
          100: '#f5f5f5',
        },
      },
      fontFamily: {
        outfit: ['outfit', 'sans-serif'],
        'outfit-medium': ['outfit-medium', 'sans-serif'],
        'outfit-bold': ['outfit-bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

