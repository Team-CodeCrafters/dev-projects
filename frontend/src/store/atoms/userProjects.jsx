import { atom } from 'recoil';

const userProjectsAtom = atom({
  key: 'userProjectsAtom',
  default: [],
});

export { userProjectsAtom };
