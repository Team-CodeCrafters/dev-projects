import { useSetRecoilState } from 'recoil';
import { PopupNotificationAtom } from '../store/atoms/ui';

const usePopupNotication = () => {
  const setPopupNotification = useSetRecoilState(PopupNotificationAtom);

  function showPopup(type = 'info', message) {
    const notification = { type, message };
    setPopupNotification((prev) => [...prev, notification]);
    setTimeout(() => {
      setPopupNotification((prev) => prev.slice(0, -1));
    }, 4000);
  }

  return showPopup;
};

export default usePopupNotication;
