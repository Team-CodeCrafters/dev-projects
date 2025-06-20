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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
            <p className="text-sm text-secondary-text">
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
              <div className="w-fit">
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
          <p className="mt-2 text-base text-secondary-text">
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
        <p className="mt-2 text-base text-secondary-text">
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
        <p className="mt-2 text-base text-secondary-text">••••••••</p>
      </div>

      {/* Manage Account */}
      <div className="mt-10 space-y-4 pt-4 border-t border-white-dark">
        <h2 className="text-xl mt-10 font-semibold">Manage account</h2>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-medium">Delete account</h3>
            <p className="mt-1 text-sm text-secondary-text">
              Permanently delete your Dev Projects account.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="pt-1 text-sm font-medium text-error hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Password Dialog */}
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

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="bg-black-medium w-[90%] max-w-md rounded-2xl p-6 text-white relative shadow-lg">
            <button
              className="absolute right-4 top-4 text-2xl text-white hover:text-gray-400"
              onClick={() => setShowDeleteDialog(false)}
            >
              &times;
            </button>
            <h3 className="mb-3 text-center text-xl font-semibold">Are you sure?</h3>
            <p className="mb-6 text-center text-sm text-secondary-text">
              Deleting your account is permanent and irreversible.
              You will lose all your collections and membership status, if any.
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="w-full rounded-lg border border-gray-600 py-2 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="w-full rounded-lg bg-error py-2 text-white hover:bg-red-600"
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
