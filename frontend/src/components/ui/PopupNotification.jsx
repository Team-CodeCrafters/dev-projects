import { useRecoilValue } from 'recoil';
import { PopupNotificationAtom } from '../../store/atoms/ui';

export const PopupNotification = () => {
  const popupNotification = useRecoilValue(PopupNotificationAtom);

  return (
    <div className="fixed bottom-6 right-3 z-[999] flex flex-col items-end gap-3 transition-all md:right-8">
      {popupNotification.map((notification, index) => (
        <PopupCard
          key={index}
          type={notification.type}
          message={notification.message}
        />
      ))}
    </div>
  );
};

const PopupCard = ({ type, message }) => {
  return (
    <div
      className={`font-body animate-slide-up animate-popup-animation relative z-50 w-max rounded-md bg-white/80 px-4 py-3 text-sm font-medium tracking-wide shadow-lg backdrop-blur-2xl transition-all ease-in-out ${
        type === 'success'
          ? 'bg-success/90 text-white'
          : type === 'error'
            ? 'bg-error/90 text-black'
            : 'border-black-dark border bg-white text-black'
      } `}
    >
      {message}
    </div>
  );
};
