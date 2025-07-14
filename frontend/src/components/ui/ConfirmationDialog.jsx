import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { ConfirmDialogAtom } from '../../store/atoms/dialog';

const ConfirmDialog = ({
  title = 'Are you sure?',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  children,
}) => {
  const [showDialog, setShowDialog] = useRecoilState(ConfirmDialogAtom);
  const dialogRef = useRef(null);

  useEffect(() => {
    setShowDialog(true);

    function checkKeyPress(e) {
      if (e.code === 'Escape') {
        setShowDialog(false);
        if (onCancel) onCancel();
      }
    }

    function checkMouseClick(e) {
      if (!dialogRef?.current?.contains(e.target)) {
        setShowDialog(false);
        if (onCancel) onCancel();
      }
    }
    setTimeout(() => {
      document.documentElement.addEventListener('keydown', checkKeyPress);
      document.documentElement.addEventListener('click', checkMouseClick);
    }, 0);

    return () => {
      document.documentElement.removeEventListener('keydown', checkKeyPress);
      document.documentElement.removeEventListener('click', checkMouseClick);
    };
  }, []);

  if (!showDialog) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div
        className="dark:bg-black-medium text-primary-text relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg dark:text-white"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading mb-3 text-center text-xl font-semibold">
          {title}
        </h3>
        {message && (
          <p className="dark:text-white-dark text-black-medium mb-6 text-center text-sm">
            {message}
          </p>
        )}
        {!!children ? (
          children
        ) : (
          <>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => {
                  setShowDialog(false);
                  if (onCancel) onCancel();
                }}
                className="font-heading w-full rounded-lg border border-gray-300 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDialog(false);
                  onConfirm();
                }}
                className="bg-error font-heading w-full rounded-lg py-2 text-white hover:bg-red-600"
              >
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDialog;
