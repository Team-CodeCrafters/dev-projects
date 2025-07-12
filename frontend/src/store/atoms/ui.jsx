import { atom } from 'recoil';

export const PopupNotificationAtom = atom({
  key: 'PopupNotificationAtom',
  default: {
    visible: false,
    type: '',
    message: '',
  },
});
