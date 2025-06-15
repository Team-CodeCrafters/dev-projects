import { atom } from 'recoil';

// Helper function to get initial theme without causing SSR issues
const getStoredTheme = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored && stored !== 'undefined') {
      return stored;
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'dark';
};

export const colorThemeAtom = atom({
  key: 'colorThemeAtom',
  default: getStoredTheme(),
});
