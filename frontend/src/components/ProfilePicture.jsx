import React, { useRef, useState, useEffect } from 'react';

const ProfilePicture = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) setImage(storedImage);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => fileInputRef.current.click();

  const handleDelete = () => {
    setImage(null);
    localStorage.removeItem('profileImage');
  };

  return (
    <div
      className="relative w-28 h-28 rounded-full border-2 border-white overflow-hidden group cursor-pointer"
    >
      {image ? (
        <img src={image} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        // Upload section with hover effects
        <div
          className="w-full h-full flex items-center justify-center bg-black-light text-white text-sm transition-all duration-300 hover:bg-black-medium hover:scale-105 hover:text-accent hover:shadow-lg"
          onClick={handleClick}
        >
          Upload
        </div>
      )}

      {image && (
        <div className="absolute inset-0 bg-black bg-opacity-60 hidden group-hover:flex flex-col items-center justify-center text-white transition">
          <button onClick={handleClick} className="text-sm font-medium hover:underline">
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
  );
};

export default ProfilePicture;
