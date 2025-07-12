import { useSetRecoilState } from 'recoil';
import { PopupNotificationAtom } from '../store/atoms/ui';

const usePopupNotication = () => {
  const setPopupNotification = useSetRecoilState(PopupNotificationAtom);

  function showPopup(type = 'info', message) {
    setPopupNotification({
      visible: true,
      type,
      message,
    });
  }

  return showPopup;
};

export default usePopupNotication;
