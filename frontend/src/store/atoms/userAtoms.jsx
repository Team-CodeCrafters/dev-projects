import { atom } from 'recoil';

const signInDataAtom = atom({
  key: 'userSignInData',
  default: {
    identifier: '',
    password: '',
  },
});

const signUpDataAtom = atom({
  key: 'userSignUpData',
  default: {
    username: '',
    email: '',
    password: '',
  },
});

const userProfileAtom = atom({
  key: 'userProfileAtom',
  default: null,
});

export { signInDataAtom, signUpDataAtom, userProfileAtom };
