import { useSetRecoilState } from 'recoil';
import { PopupNotificationAtom } from '../store/atoms/ui';

let popupId = 0;
const usePopupNotication = () => {
  const setPopupNotification = useSetRecoilState(PopupNotificationAtom);

  function showPopup(type = 'info', message) {
    ++popupId;
    const currentId = popupId;
    const notification = { type, message, popupId: currentId };
    setPopupNotification((prev) => [...prev, notification]);

    setTimeout(() => {
      setPopupNotification((prev) =>
        prev.filter((popup) => popup.popupId !== currentId),
      );
    }, 3000);
  }

  return showPopup;
};

export default usePopupNotication;
