import { atom } from 'recoil';

export const projectDetailsAtom = atom({
  key: 'projectDetailsAtom',
  default: null,
});
export const projectDetailsTab = atom({
  key: 'projectDetailsTab',
  default: 'get-started',
});
