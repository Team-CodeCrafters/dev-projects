import { memo, useEffect } from 'react';
import ProfilePicture from '../components/user/ProfilePicture';
import PersonalDetails from '../components/user/PersonalDetails';
import { useNavigate } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import {
  userProfileAtom,
  userProfileTabsAtom,
  userSubmissionsAtom,
} from '../store/atoms/userAtoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import usePopupNotication from '../hooks/usePopup';
import TabsLayout from '../components/layout/TabsLayout';
import NoContentToDisplay from '../components/ui/NoContent';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [userSubmissions, setUserSubmissions] =
    useRecoilState(userSubmissionsAtom);
  const { fetchData: fetchUserData, loading: loadingUserProfile } =
    useFetchData();
  const showPopup = usePopupNotication();
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

      const res = await fetchUserData('/user/profile', options);
      if (res.success && res.data.user) {
        setUserProfile(res.data.user);
      } else {
        showPopup('error', res.error);
      }
    }
    if (!userProfile) fetchUserProfile();
  }, []);

  return (
    <div className="flex w-full flex-col items-center px-4 py-10 text-white">
      <ProfilePicture userProfile={userProfile} />
      <div className="animate-fade-in text-primary-text mt- w-full max-w-2xl space-y-8 px-4 dark:text-white">
        <UserProfileTabs />
        <ManageUserTabs
          loadingUser={loadingUserProfile}
          loadingSubmissions={loadingUserProfile}
          userProfile={userProfile}
          userSubmissions={userSubmissions}
        />
      </div>
    </div>
  );
};

const UserProfileTabs = () => {
  const userProfileTabs = [
    { label: 'Account', value: 'account' },
    { label: 'Submissions', value: 'submissions' },
  ];

  return (
    <div className="my-3 w-max max-w-2xl px-4">
      <TabsLayout tabs={userProfileTabs} activeTabAtom={userProfileTabsAtom} />
    </div>
  );
};

const ManageUserTabs = memo(
  ({ userProfile, loadingUser, userSubmissions, loadingSubmissions }) => {
    const activeTab = useRecoilValue(userProfileTabsAtom);

    if (activeTab === 'account') {
      return (
        <PersonalDetails userProfile={userProfile} loading={loadingUser} />
      );
    }

    if (activeTab === 'submissions') {
      return (
        <NoContentToDisplay
          heading={'No Submissions done yet'}
          body={'submit a project to view it here'}
        />
      );
    }

    return null;
  },
);

export default UserProfile;
