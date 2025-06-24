import { useRef, useState, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';
import { PopupNotification } from './PopupNotification';
import { useRecoilValue } from 'recoil';
import { userProfileAtom } from '../store/atoms/userAtoms';

const ProfilePicture = () => {
  const [image, setImage] = useState(null);
  const [popup, setPopup] = useState({ show: false, text: '', type: 'info' });
  const fileInputRef = useRef(null);
  const userProfile = useRecoilValue(userProfileAtom);
  const { fetchData } = useFetchData();

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) setImage(storedImage);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem('profileImage', reader.result);

        setPopup({
          show: true,
          text: 'Profile picture updated successfully!',
          type: 'success',
        });
      };
      reader.readAsDataURL(file);
    }

    const token = localStorage.getItem('token');

    if (!token) return;

    const formData = new FormData();
    formData.append('avatar', file);
    console.log(file);

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      method: 'PUT',

      body: formData,
    };

    const res = await fetchData('/user/update-profile', options);
    console.log('Profile Fetch Result:', res);
  };

  const handleClick = () => fileInputRef.current.click();

  const handleDelete = () => {
    setImage(null);
    localStorage.removeItem('profileImage');
    setPopup({
      show: 'true',
      text: 'Profile picture deleted.',
      type: 'info',
    });
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
        {image ? (
          <img
            src={image}
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

        {image && (
          <div className="bg-opacity-90 absolute inset-0 hidden flex-col items-center justify-center bg-black text-white transition-all group-hover:flex">
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
