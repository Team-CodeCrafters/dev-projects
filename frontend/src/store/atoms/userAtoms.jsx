import { atom, selector } from 'recoil';

const signInDataAtom = atom({
  key: 'userSignInData',
  default: {
    identifier: '',
    password: '',
  },
});

const signInSelector = selector({
  key: 'signInSelector',
  get: async ({ get }) => {
    const data = get(signInDataAtom);
  },
});

export { signInDataAtom, signInSelector };
