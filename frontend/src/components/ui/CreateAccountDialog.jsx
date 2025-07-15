import { Link } from 'react-router-dom';
import ConfirmDialog from './ConfirmationDialog';
import CancelIcon from '../../assets/icons/Cancel';
import {
  ConfirmDialogAtom,
  createAccountDialogAtom,
} from '../../store/atoms/dialog';
import { useSetRecoilState } from 'recoil';

const CreateAccountDialog = () => {
  const setShowDialog = useSetRecoilState(ConfirmDialogAtom);
  const setCreateAccountDialog = useSetRecoilState(createAccountDialogAtom);
  return (
    <ConfirmDialog
      title="Create Dev Projects Account"
      message={'Start Building Today'}
      onCancel={() => {
        setShowDialog(false);
        setCreateAccountDialog(false);
      }}
    >
      <div className="mb-3 mt-4 flex items-start justify-center gap-4">
        <Link
          to={'/signup'}
          className="font-heading dark:bg-white-medium w-24 rounded-full bg-black p-2 px-4 text-center text-white dark:text-black"
        >
          signup
        </Link>
        <Link
          to={'/login'}
          className="font-heading dark:bg-white-medium w-24 rounded-full bg-black p-2 px-4 text-center text-white dark:text-black"
        >
          login
        </Link>
      </div>
      <button
        onClick={() => {
          setShowDialog(false);
          setCreateAccountDialog(false);
        }}
        className="absolute right-3 top-1 cursor-pointer p-1"
      >
        <CancelIcon />
      </button>
    </ConfirmDialog>
  );
};
export default CreateAccountDialog;
