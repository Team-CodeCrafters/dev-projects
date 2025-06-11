import { useRecoilState } from 'recoil';
import { colorThemeAtom } from '../store/atoms/themeAtoms';
import { useEffect } from 'react';

function getInitialTheme() {
  let theme = localStorage.getItem('theme');
  if (!theme || theme === 'undefined') {
    const prefersDarkTheme = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    if (prefersDarkTheme) {
      localStorage.setItem('theme', 'dark');
      theme = 'dark';
    } else {
      localStorage.setItem('theme', 'light');
      theme = 'light';
    }
  }
  return theme;
}

function applyTheme(theme) {
  if (theme === 'light') document.body.classList.remove('dark');
  if (theme === 'dark') document.body.classList.add('dark');
}

export const useTheme = () => {
  const [theme, setTheme] = useRecoilState(colorThemeAtom);

  function setCurrentTheme() {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
  }

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }, [theme]);

  return { theme, setTheme, setCurrentTheme };
};
