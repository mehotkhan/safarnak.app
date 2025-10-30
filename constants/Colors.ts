const tintColorLight = '#0077be';
const tintColorDark = '#cfe8f6';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    card: '#f8f9fa',
    border: '#e9ecef',
    shadow: '#000',
    // Template-aligned additions (Persian Turquoise)
    primary: '#0077be', // Ocean Blue (primary)
    primaryMuted: '#4aa3d9', // lighter ocean blue
    neutral100: '#f5f5f5',
    textMuted: '#6b7280',
    danger: '#ef4444',
    success: '#10b981',
  },
  dark: {
    text: '#fff',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    card: '#1e1e1e',
    border: '#333',
    shadow: '#000',
    // Template-aligned additions
    primary: '#4aa3d9', // ocean blue light for dark theme
    primaryMuted: '#3691cf',
    neutral100: '#2a2a2a',
    textMuted: '#9ca3af',
    danger: '#f87171',
    success: '#34d399',
  },
};
