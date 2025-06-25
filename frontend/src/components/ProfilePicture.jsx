import { useRef, useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import { PopupNotification } from './PopupNotification';
import { useSetRecoilState } from 'recoil';
import { userProfileAtom } from '../store/atoms/userAtoms';

const ProfilePicture = ({ userProfile }) => {
  const [popup, setPopup] = useState({ show: false, text: '', type: 'info' });
  const fileInputRef = useRef(null);
  const setUserProfile = useSetRecoilState(userProfileAtom);
  const { fetchData } = useFetchData();

  const handleImageChange = async (e) => {
    setPopup({
      show: 'true',
      text: 'changing profile picture...',
      type: 'info',
    });

    const file = e.target.files[0];
    const token = localStorage.getItem('token');

    if (!token) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      method: 'PUT',

      body: formData,
    };

    const res = await fetchData('/user/update-profile', options);
    if (res.success) {
      setUserProfile(res.data.user);
      setPopup({
        show: 'true',
        text: 'profile updated successfully',
        type: 'success',
      });
    } else {
      setPopup({
        show: 'true',
        text: res.error,
        type: 'info',
      });
    }
  };

  const handleClick = () => fileInputRef.current.click();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const formData = new FormData();
    formData.append('profilePicture', 'DELETE');
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      body: formData,
    };

    const res = await fetchData('/user/update-profile', options);
    if (res.success) {
      setPopup({
        show: 'true',
        text: 'Profile picture deleted.',
        type: 'info',
      });
      setUserProfile((prev) => ({ ...prev, profilePicture: null }));
    } else {
      setPopup({
        show: 'true',
        text: res.error,
        type: 'info',
      });
    }
  };

  return (
    <>
      {popup.show && (
        <PopupNotification
          text={popup.text}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}

      <div className="group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-2 border-white">
        {userProfile?.profilePicture ? (
          <img
            src={userProfile.profilePicture}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="bg-black-light hover:bg-black-medium hover:text-accent flex h-full w-full items-center justify-center text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={handleClick}
          >
            Upload
          </div>
        )}

        {userProfile?.profilePicture && (
          <div className="absolute inset-0 hidden flex-col items-center justify-center bg-black bg-opacity-90 text-white transition-all group-hover:flex">
            <button
              onClick={handleClick}
              className="text-sm font-medium hover:underline"
            >
              Change
            </button>
            <button
              onClick={handleDelete}
              className="mt-2 text-sm text-gray-400 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <p className="mt-5 text-2xl font-semibold text-black dark:text-white">
        {userProfile?.username}
      </p>
    </>
  );
};

export default ProfilePicture;
