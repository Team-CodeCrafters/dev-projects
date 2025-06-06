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
  default: false,
});
