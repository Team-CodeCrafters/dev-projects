import { useRecoilValue } from 'recoil';
import { PopupNotificationAtom } from '../../store/atoms/ui';

export const PopupNotification = () => {
  const popupNotification = useRecoilValue(PopupNotificationAtom);

  console.log(popupNotification);

  return (
    <div className="fixed bottom-6 right-8 z-[999] flex flex-col items-end gap-3 transition-all">
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
      className={`font-body animate-slide-up animate-popup-animation relative z-50 w-max rounded-md px-4 py-3 font-medium tracking-wide shadow-lg transition-all ease-in-out ${
        type === 'success'
          ? 'bg-success text-white'
          : type === 'error'
            ? 'bg-error text-black'
            : 'border-black-dark border bg-white text-black'
      } `}
    >
      {message}
    </div>
  );
};
