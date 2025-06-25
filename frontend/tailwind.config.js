/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#635BFF',
        secondary: '#6366F1',
        accent: '#A662E2',
        success: '#22c55e',
        error: '#EF4444',
        'white-light': '#FFF',
        'white-medium': '#F6F8fA',
        'white-dark': '#F2F2F3',

        'blak-ligher': '303037',
        'black-light': '#27272A',
        'black-medium': '#18181B',
        'black-dark': '#0F0F0F',
        'black-neutral': '#171717',

        'primary-text': '#1A1A1A',
        'secondary-text': '#6B7280',
      },

      fontFamily: {
        heading: ['Geist', 'system-ui', 'sans-serif'],
        body: ['Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
