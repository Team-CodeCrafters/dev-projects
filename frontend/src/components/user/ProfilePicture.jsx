import { useRef } from 'react';
import useFetchData from '../../hooks/useFetchData';
import { useSetRecoilState } from 'recoil';
import { userProfileAtom } from '../../store/atoms/userAtoms';
import usePopupNotication from '../../hooks/usePopup';

const ProfilePicture = ({ userProfile }) => {
  const fileInputRef = useRef(null);
  const setUserProfile = useSetRecoilState(userProfileAtom);
  const { fetchData } = useFetchData();
  const showPopup = usePopupNotication();
  const handleImageChange = async (e) => {
    showPopup('info', 'changing profile picture...');
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
      showPopup('success', 'profile updated successfully');
    } else {
      showPopup('error', res.error);
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
      showPopup('c', 'Profile picture deleted.');
      setUserProfile((prev) => ({ ...prev, profilePicture: null }));
    } else {
      showPopup('error', res.error);
    }
  };

  return (
    <>
      <div className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-white">
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

      <p className="font-heading mt-5 text-xl font-bold text-black md:text-2xl dark:text-white">
        {userProfile?.username}
      </p>
    </>
  );
};

export default ProfilePicture;
