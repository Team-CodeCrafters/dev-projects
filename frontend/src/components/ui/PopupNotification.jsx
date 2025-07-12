import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { PopupNotificationAtom } from '../../store/atoms/ui';

export const PopupNotification = ({ text, type = 'info' }) => {
  const [popupNotification, setPopupNotification] = useRecoilState(
    PopupNotificationAtom,
  );

  useEffect(() => {
    let timer;
    if (popupNotification.visible) {
      timer = setTimeout(() => {
        setPopupNotification((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [popupNotification.visible]);

  return (
    <>
      <div
        className={`font-body fixed bottom-6 right-8 z-[999] rounded-md px-4 py-3 font-medium tracking-wide shadow-lg transition-all duration-700 ease-in-out ${popupNotification.visible ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0'} ${
          popupNotification.type === 'success'
            ? 'bg-success text-white'
            : popupNotification.type === 'error'
              ? 'bg-error text-black'
              : 'border-black-dark border bg-white text-black'
        } `}
      >
        {popupNotification.message}
      </div>
    </>
  );
};
