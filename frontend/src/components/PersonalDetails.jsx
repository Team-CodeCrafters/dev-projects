import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userProfileAtom } from '../store/atoms/userAtoms';
import useFetchData from '../hooks/useFetchData';
import SkeletalLoader from './SkeletalLoader';
import { PopupNotification } from './PopupNotification';

const PersonalDetails = ({ userProfile, loading }) => {
  const navigate = useNavigate();
  const [editedName, setEditedName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [popup, setPopup] = useState({ show: false, text: '', type: 'info' });

  const setUserProfile = useSetRecoilState(userProfileAtom);
  const { fetchData } = useFetchData();

  const showPopup = (text, type = 'info') => {
    setPopup({ show: true, text, type });
  };

  async function updateDisplayName() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('displayName', editedName);

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      body: formData,
    };

    await fetchData('/user/update-profile', options);
  }

  const handleSave = () => {
    setUserProfile((prev) => ({ ...prev, displayName: editedName }));
    setEditMode(false);
    updateDisplayName();
    showPopup('Name updated successfully!', 'success');
  };

  const handleCancelEditName = () => {
    setEditMode(false);
    showPopup('Name edit cancelled.', 'info');
  };

  const handlePasswordChange = () => {
    navigate('/forgot-password');
  };

  const handleCancelPasswordDialog = () => {
    setShowPasswordDialog(false);
    showPopup('Password change cancelled.', 'info');
  };

  const handleCancelDeleteDialog = () => {
    setShowDeleteDialog(false);
    showPopup('Account deletion cancelled.', 'info');
  };

  async function deleteUserAccount() {
    const options = {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'DELETE',
    };
    const res = await fetchData('/user/', options);
    if (res.success) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }

  return (
    <div className="animate-fade-in text-primary-text mt-20 w-full max-w-2xl space-y-8 px-4 dark:text-white">
      {popup.show && (
        <PopupNotification
          text={popup.text}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}

      {loading ? (
        <>
          <SkeletalLoader height="h-6" width="w-1/3" />
          <SkeletalLoader height="h-14" width="w-full" />
          <SkeletalLoader height="h-14" width="w-full" />
          <SkeletalLoader height="h-14" width="w-full" />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">Personal details</h1>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-primary-text text-base font-medium dark:text-white">
                Name
              </h2>
              {!editMode && (
                <button
                  className="text-primary text-sm hover:underline dark:text-white"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              )}
            </div>

            {editMode ? (
              <div className="mt-4 space-y-4">
                <p className="text-secondary-text text-sm">
                  This will be visible on your profile and to other team
                  members.
                </p>
                <div>
                  <label className="text-primary-text mb-1 block text-sm dark:text-white">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-primary-text border-white-dark bg-white-medium dark:bg-black-light dark:border-white-dark w-full rounded-lg border p-3 dark:text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-fit">
                    <button
                      onClick={handleSave}
                      className="bg-primary hover:bg-secondary rounded-lg px-4 py-1.5 font-medium text-white transition"
                    >
                      Save
                    </button>
                  </div>
                  <button
                    onClick={handleCancelEditName}
                    className="text-primary hover:underline dark:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-secondary-text mt-2 text-base">
                {userProfile?.displayName || 'You have not set any Name.'}
              </p>
            )}
          </div>

          <hr className="border border-gray-300 dark:border-gray-700" />

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-primary-text text-base font-medium dark:text-white">
                Email address
              </h2>
            </div>
            <p className="text-secondary-text mt-2 text-base">
              {userProfile?.email}
            </p>
          </div>

          <hr className="border border-gray-300 dark:border-gray-700" />

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-primary-text text-base font-medium dark:text-white">
                Password
              </h2>
              <button
                className="text-primary text-sm hover:underline dark:text-white"
                onClick={() => setShowPasswordDialog(true)}
              >
                Create new
              </button>
            </div>
            <p className="text-secondary-text mt-2 text-base">••••••••</p>
          </div>
        </>
      )}

      <div className="dark:border-white-dark mt-10 space-y-4 border-t border-gray-300 pt-4">
        <h2 className="text-primary-text mt-10 text-xl font-semibold dark:text-white">
          Manage account
        </h2>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-primary-text font-medium dark:text-white">
              Delete account
            </h3>
            <p className="text-secondary-text mt-1 text-sm">
              Permanently delete your Dev Projects account.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="text-error pt-1 text-sm font-medium hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-primary-text dark:bg-black-medium w-[90%] max-w-md rounded-xl bg-white p-6 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Are you sure?</h3>
            <p className="text-secondary-text mb-6">
              You will be redirected to create a new password. This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-white-light text-primary-text hover:bg-white-dark dark:bg-white-dark rounded-md px-4 py-2 dark:text-black dark:hover:bg-white"
                onClick={handleCancelPasswordDialog}
              >
                Cancel
              </button>
              <button
                className="bg-error rounded-md px-4 py-2 text-white hover:bg-red-600"
                onClick={handlePasswordChange}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="dark:bg-black-medium text-primary-text relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg dark:text-white">
            <button
              className="text-primary-text absolute right-4 top-4 text-2xl hover:text-gray-400 dark:text-white"
              onClick={handleCancelDeleteDialog}
            ></button>
            <h3 className="mb-3 text-center text-xl font-semibold">
              Are you sure?
            </h3>
            <p className="text-secondary-text mb-6 text-center text-sm">
              Deleting your account is permanent and irreversible. <br />
              You will lose all your data related to your account.
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleCancelDeleteDialog}
                className="w-full rounded-lg border border-gray-300 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  deleteUserAccount();
                }}
                className="bg-error w-full rounded-lg py-2 text-white hover:bg-red-600"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;
