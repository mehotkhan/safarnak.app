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
  // Disable unused core plugins for React Native (reduces bundle size)
  corePlugins: {
    preflight: false,      // No CSS reset needed in RN
    container: false,      // Not used in RN
    float: false,          // Not supported in RN
    clear: false,          // Not supported in RN
    objectFit: false,      // Not supported in RN
    objectPosition: false, // Not supported in RN
    overscrollBehavior: false,
    textDecoration: false, // Limited support in RN
    writingMode: false,    // Not supported in RN
  },
  plugins: [],
};

