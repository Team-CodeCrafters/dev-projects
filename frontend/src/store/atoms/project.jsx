import { atom } from 'recoil';

export const projectDetailsAtom = atom({
  key: 'projectDetailsAtom',
  default: null,
});
export const projectDetailsTab = atom({
  key: 'projectDetailsTab',
  default: 'get-started',
});

export const BookmarkedProjectsAtom = atom({
  key: 'BookmarkedProjectsAtom',
  default: [],
});

export const similarProjectsAtom = atom({
  key: 'similarProjectsAtom',
  default: [],
});
