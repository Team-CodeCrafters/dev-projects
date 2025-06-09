import { atom, selector } from 'recoil';

export const colorThemeAtom = atom({
  key: 'colorThemeAtoms',
  default: 'dark',
});
