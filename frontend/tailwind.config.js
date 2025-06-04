/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6366F1',
        accent: '#F59E0B',
        success: '#22c55e',
        error: '#EF4444',

        'white-light': '#FFF',
        'white-medium': '#FAFAFA',
        'white-dark': '#F6F8fA',

        'black-light': '#2D2D2D',
        'black-medium': '#1A1A1A',
        'black-dark': '#000',

        'primary-text': '#1A1A1A',
        'secondary-text': '#6B7280',
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
