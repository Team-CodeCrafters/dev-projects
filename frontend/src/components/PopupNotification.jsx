import { useState, useEffect } from 'react';

export const PopupNotification = ({ text, type = 'info', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 100);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`font-body fixed bottom-6 right-8 z-[999] rounded-md px-4 py-3 font-medium tracking-wide shadow-lg transition-all duration-700 ease-in-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-40 opacity-0'} ${
        type === 'success'
          ? 'bg-green-500 text-white'
          : type === 'error'
            ? 'bg-red-500 text-black'
            : 'border-black-dark border bg-white text-black'
      } `}
    >
      {text}
    </div>
  );
};
