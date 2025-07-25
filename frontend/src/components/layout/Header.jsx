import { Link, useNavigate } from 'react-router-dom';
import NotificationIcon from '../../assets/icons/notificationIcon';
import { SearchIcon } from '../../assets/icons/Search';
import { MenuIcon } from '../../assets/icons/MenuIcon';
import { ProfileIcon } from '../../assets/icons/ProfileIcon';
import { ArrowLeft } from '../../assets/icons/ArrowLeft';
import Button from '../ui/Button';
import { ToggleSwitch } from '../../assets/icons/ToggleSwitch';
import brandImageLight from '../../assets/images/dev-projects-dark.png';
import brandImageDark from '../../assets/images/dev-projects-logo.png';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  sidebarOpenAtom,
  dropDownOpenAtom,
  searchBoxAtom,
} from '../../store/atoms/dashboardLayoutAtoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { colorThemeAtom } from '../../store/atoms/themeAtoms';
import { userProfileAtom } from '../../store/atoms/userAtoms';
import useFetchData from '../../hooks/useFetchData';

const DashboardHeader = memo(() => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useRecoilState(searchBoxAtom);
  const toggleSearchBar = () => {
    setIsSearchBarOpen((prev) => !prev);
  };

  return (
    <header className="bg-white-light dark:border-b-black-light dark:bg-black-medium relative z-40 flex h-16 items-center justify-between gap-12 border-b-2 px-4 lg:px-6 dark:text-white">
      {isSearchBarOpen ? (
        <div className="flex w-full items-center justify-between gap-6">
          <button onClick={toggleSearchBar}>
            <ArrowLeft />
          </button>
          <SearchBar />
        </div>
      ) : (
        <HeaderContent />
      )}
    </header>
  );
});

const HeaderContent = () => {
  const setIsSidebarOpen = useSetRecoilState(sidebarOpenAtom);
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const theme = useRecoilValue(colorThemeAtom);
  const setIsSearchBarOpen = useSetRecoilState(searchBoxAtom);
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, [setIsSidebarOpen]);

  const toggleSearchBar = () => {
    setIsSearchBarOpen((prev) => !prev);
  };
  const { fetchData } = useFetchData();
  async function fetchUserProfile() {
    const token = localStorage.getItem('token');
    const options = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const fetchResult = await fetchData('/user/profile', options);

    if (fetchResult.success) {
      setUserProfile(fetchResult.data.user);
    }
  }
  useEffect(() => {
    if (userProfile) return;
    fetchUserProfile();
  }, []);

  return (
    <>
      <div className="flex items-center gap-1.5 lg:gap-4">
        <button
          className="hover:bg-white-medium focus:ring-primary dark:hover:bg-black-light cursor-pointer rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </button>
        <div className="max-h-12 w-32">
          <Link to="/">
            <img
              src={theme === 'light' ? brandImageDark : brandImageLight}
              alt="Dev Projects logo"
              className="max-h-full object-contain"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>
      </div>
      <div className="hidden h-9 w-full max-w-sm items-center justify-center sm:flex">
        <SearchBar />
      </div>
      <div className="flex max-h-full items-center gap-3 lg:gap-3">
        <div className="flex sm:hidden">
          <button
            className="hover:bg-white-medium dark:hover:bg-black-light focus:ring-primary cursor-pointer rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2"
            onClick={toggleSearchBar}
          >
            <SearchIcon />
          </button>
        </div>
        <UserHeaderMenu />
      </div>
    </>
  );
};

const UserHeaderMenu = () => {
  const userProfile = useRecoilValue(userProfileAtom);
  const [isDropDownOpen, setDropDownOpen] = useRecoilState(dropDownOpenAtom);
  const profileButtonRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const navigate = useNavigate();
  function redirectToLogin() {
    navigate('/login');
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn && isLoggedIn !== undefined) {
    return (
      <div className="">
        <Button
          text={'Login'}
          onClick={redirectToLogin}
          styles={'md:!min-w-28 !min-w-20 !h-11'}
        />
      </div>
    );
  }
  return (
    <>
      <button className="hover:bg-white-medium dark:hover:bg-black-light focus:ring-primary cursor-pointer rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2">
        <NotificationIcon />
      </button>
      <button
        className="focus:ring-primary group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2"
        ref={profileButtonRef}
        onClick={() => setDropDownOpen((prev) => !prev)}
      >
        {userProfile?.profilePicture ? (
          <img
            src={userProfile.profilePicture}
            alt="profile icon"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <ProfileIcon />
        )}
        <ProfileDropDown
          isVisible={isDropDownOpen}
          setIsVisible={setDropDownOpen}
          profileButtonRef={profileButtonRef}
        />
      </button>
    </>
  );
};

const SearchBar = () => {
  return (
    <div className="dark:bg-black-light flex h-10 max-w-sm flex-1 rounded-3xl">
      <div className="w-full flex-1">
        <input
          type="text"
          placeholder="Search"
          className="dark:bg-black-medium focus:border-primary border-black-light outline-black-light h-full w-full rounded-bl-3xl rounded-tl-3xl border-2 pl-8 outline-none outline-offset-[-2px] focus:outline-none"
        />
      </div>
      <div className="dark:bg-black-light border-black-light dark:border-black-light flex w-12 cursor-pointer items-center justify-center rounded-br-3xl rounded-tr-3xl border-[1px] border-l-transparent">
        <SearchIcon />
      </div>
    </div>
  );
};

const ProfileDropDown = ({ isVisible, setIsVisible, profileButtonRef }) => {
  const [theme, setTheme] = useRecoilState(colorThemeAtom);
  const dropDownRef = useRef(null);
  const setUserProfile = useSetRecoilState(userProfileAtom);
  const toggleTheme = useCallback(() => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  }, []);
  const navigate = useNavigate();
  const LogOutUser = useCallback(() => {
    setUserProfile(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, []);

  useEffect(() => {
    function checkClick(e) {
      const clickedInsideDropdown =
        profileButtonRef?.current?.contains(e.target) ||
        dropDownRef.current?.contains(e.target);
      if (!clickedInsideDropdown) {
        setIsVisible(false);
      }
    }

    document.body.addEventListener('click', checkClick);
    return () => document.body.removeEventListener('click', checkClick);
  }, [setIsVisible, profileButtonRef]);
  return (
    <div
      ref={dropDownRef}
      className={`dark:bg-black-medium absolute right-[30%] top-[130%] grid h-max w-52 items-center rounded-md bg-white shadow-md transition-all duration-300 ${isVisible ? `visible translate-y-2 opacity-100` : `invisible translate-y-[-20%] opacity-0`}`}
    >
      <ul className="font-body flex flex-col gap-2 p-4 text-left text-sm">
        <li className="hover:bg-white-medium dark:hover:bg-black-light min-h-6 rounded-md">
          <Link to="/profile" className="block h-full px-4 py-2">
            Profile
          </Link>
        </li>
        <li className="hover:bg-white-medium dark:hover:bg-black-light flex items-center justify-between rounded-md px-4 py-2">
          <label
            htmlFor="theme-toggle"
            className="flex w-full cursor-pointer items-center justify-between"
          >
            dark mode
            <span className="relative top-1">
              <ToggleSwitch
                onChange={toggleTheme}
                id="theme-toggle"
                currentTheme={theme}
              />
            </span>
          </label>
        </li>
        <li
          className="hover:bg-white-medium dark:hover:bg-black-light min-h-8 rounded-md"
          onClick={LogOutUser}
        >
          <Link className="block h-full px-4 py-2 font-medium text-red-500">
            Log out
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default DashboardHeader;
