import { useEffect } from 'react';
import ProfilePicture from '../components/ProfilePicture';
import PersonalDetails from '../components/PersonalDetails';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-4 py-10 text-white">
      <ProfilePicture />
      <PersonalDetails />
    </div>
  );
};

export default UserProfile;
