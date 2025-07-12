import { useEffect } from 'react';
import ProfilePicture from '../components/user/ProfilePicture';
import PersonalDetails from '../components/user/PersonalDetails';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { userProfileAtom } from '../store/atoms/userAtoms';
import { PopupNotification } from '../components/ui/PopupNotification';
import { useRecoilState } from 'recoil';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const { fetchData, loading } = useFetchData();

  useEffect(() => {
    document.title = 'Dev Projects | Profile';
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');

    async function fetchUserProfile() {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await fetchData('/user/profile', options);
      if (res.success && res.data.user) {
        setUserProfile(res.data.user);
      } else {
        <PopupNotification type="error" text={res.error} />;
      }
    }
    if (!userProfile) fetchUserProfile();
  }, []);

  return (
    <div className="flex w-full flex-col items-center px-4 py-10 text-white">
      <ProfilePicture userProfile={userProfile} />
      <PersonalDetails userProfile={userProfile} loading={loading} />
    </div>
  );
};

export default UserProfile;
