import { atom } from 'recoil';

export const ConfirmDialogAtom = atom({
  key: 'ConfirmDialogBoxAtom',
  default: true,
});

export const createAccountDialogAtom = atom({
  key: 'createAccountDialogAtom',
  default: false,
});
