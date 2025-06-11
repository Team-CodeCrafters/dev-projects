import { atom } from 'recoil';

export const screenSizeAtom = atom({
  key: 'screensizeAtom',
  default: {
    width: window?.innerWidth || 0,
    height: window?.innerHeight || 0,
  },
});

export const sidebarOpenAtom = atom({
  key: 'sidebarAtom',
  default: window.innerWidth > 768 ? true : false,
});

export const dropDownOpenAtom = atom({
  key: 'dropDownOpenAtom',
  default: false,
});

export const searchBoxAtom = atom({
  key: 'searchBoxAtom',
  default: false,
});
