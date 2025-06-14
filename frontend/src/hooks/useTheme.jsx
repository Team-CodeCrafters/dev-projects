import { useRecoilState } from 'recoil';
import { colorThemeAtom } from '../store/atoms/themeAtoms';
import { useEffect } from 'react';

function getInitialTheme() {
  let theme = localStorage.getItem('theme');
  if (!theme || theme === 'undefined') {
    const prefersDarkTheme = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    theme = prefersDarkTheme ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }
  return theme;
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark');
  } else if (theme === 'dark') {
    document.body.classList.add('dark');
  }
}

export const useTheme = () => {
  const [theme, setTheme] = useRecoilState(colorThemeAtom);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    if (theme !== initialTheme) {
      setTheme(initialTheme);
    }
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    }
  }, [theme]);

  const setCurrentTheme = () => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    setCurrentTheme,
    toggleTheme,
  };
};
