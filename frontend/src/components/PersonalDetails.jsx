import React, { useEffect, useState } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalDetails = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/user/profile');
        setUserData({ name: res.data.displayName, email: res.data.email });
        setEditedName(res.data.displayName);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put('/user/update-profile', { name: editedName });
      setUserData((prev) => ({ ...prev, name: editedName }));
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordDialog(false);
    navigate('/forgot-password');
  };

  return (
    <div className="animate-fade-in mt-20 w-full max-w-2xl space-y-8 px-4 text-white">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Personal details</h1>

      {/* Name */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-white">Name</h2>
          {!editMode && (
            <button
              className="text-sm text-white hover:underline"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>

        {editMode ? (
          <div className="mt-4 space-y-4">
            <p className="text-secondary-text text-sm">
              This will be visible on your profile and to other team members.
            </p>
            <div>
              <label className="mb-1 block text-sm text-white">Full name</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-black-light border-white-dark w-full rounded-lg border p-3 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="w-32">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-white px-4 py-1.5 font-medium text-black transition hover:bg-gray-200"
                >
                  Save
                </button>
              </div>
              <button
                onClick={() => setEditMode(false)}
                className="text-white hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-secondary-text mt-2 text-base">
            {userData.name || 'Not available'}
          </p>
        )}
      </div>

      <hr className="border-gray-700" />

      {/* Email */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-white">Email address</h2>
        </div>
        <p className="text-secondary-text mt-2 text-base">
          {userData.email || 'Not available'}
        </p>
      </div>

      <hr className="border-gray-700" />

      {/* Password */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-white">Password</h2>
          <button
            className="text-sm text-white hover:underline"
            onClick={() => setShowPasswordDialog(true)}
          >
            Create new
          </button>
        </div>
        <p className="text-secondary-text mt-2 text-base">••••••••</p>
      </div>

      {/* Dialog Box */}
      {showPasswordDialog && (
        <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="bg-black-medium w-[90%] max-w-md rounded-xl p-6 text-white">
            <h3 className="mb-4 text-xl font-semibold">Are you sure?</h3>
            <p className="text-secondary-text mb-6">
              You will be redirected to create a new password. This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-white-dark rounded-md px-4 py-2 text-black hover:bg-white"
                onClick={() => setShowPasswordDialog(false)}
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
    </div>
  );
};

export default PersonalDetails;
