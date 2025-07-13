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

        'black-lighter': '#303037',
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
      keyframes: {
        loadingBar: {
          '0%': { width: '0%', display: 'block' },
          '100%': { width: '95%' },
        },
        loadingComplete: {
          '0%': { width: '90%' },
          '100%': { width: '100%', display: 'none' },
        },
        popupAnimation: {
          '0%': {
            transform: 'translateY(10rem)',
            opacity: '0',
          },
          '10%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '70%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '90%': {
            transform: 'translateX(120%)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'translateX(150%)',
            opacity: '0',
          },
        },
      },
      animation: {
        'loading-bar': 'loadingBar 1s ease-in forwards',
        'loading-complete': 'loadingComplete 200ms ease-out forwards',
        'popup-animation': 'popupAnimation 3500ms ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
