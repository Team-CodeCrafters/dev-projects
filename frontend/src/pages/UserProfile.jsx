import React from 'react';
import ProfilePicture from '../components/ProfilePicture';
import PersonalDetails from '../components/PersonalDetails';

const UserProfile = () => {

  return (
    <div className="min-h-screen w-full px-4 py-10 flex flex-col items-center text-white">
      <ProfilePicture />
      <PersonalDetails />
    </div>
  );
};

export default UserProfile;
