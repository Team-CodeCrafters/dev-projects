import { atom } from 'recoil';

const userProjectsAtom = atom({
  key: 'userProjectsAtom',
  default: null,
});

export { userProjectsAtom };
