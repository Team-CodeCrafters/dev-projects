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
import UserSubmissions from '../components/user/userSubmissions';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [userSubmissions, setUserSubmissions] =
    useRecoilState(userSubmissionsAtom);
  const { fetchData: fetchUserData, loading: loadingUserProfile } =
    useFetchData();
  const { fetchData: fetchSubmissionData, loading: loadingSubmissions } =
    useFetchData();
  const showPopup = usePopupNotication();
  useEffect(() => {
    document.title = 'Dev Projects | Profile';
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    async function fetchUserProfile() {
      const res = await fetchUserData('/user/profile', options);
      if (res.success && res.data.user) {
        setUserProfile(res.data.user);
      } else {
        showPopup('error', res.error);
      }
    }

    async function fetchUserSubmissions() {
      const res = await fetchSubmissionData('/submissions/user/all', options);
      console.log({ res });

      if (res.success && res.data.submissions) {
        setUserSubmissions(res.data.submissions);
      } else {
        showPopup('error', res.error);
      }
    }
    if (!userProfile) fetchUserProfile();
    if (!userSubmissions) fetchUserSubmissions();
  }, []);

  return (
    <div className="flex w-full flex-col items-center px-4 py-10 text-white">
      <ProfilePicture userProfile={userProfile} />
      <div className="animate-fade-in text-primary-text mt- w-full max-w-2xl space-y-8 px-4 dark:text-white">
        <UserProfileTabs />
        <ManageUserTabs
          loadingUser={loadingUserProfile}
          loadingSubmissions={loadingSubmissions}
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
        <UserSubmissions
          userSubmissions={userSubmissions}
          loadingSubmissions={loadingSubmissions}
        />
      );
    }

    return null;
  },
);

export default UserProfile;
