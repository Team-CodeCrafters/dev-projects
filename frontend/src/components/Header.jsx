import { Link } from 'react-router-dom';
import NotificationIcon from '../assets/icons/notificationIcon';
import { SearchIcon } from '../assets/icons/Search';
import { MenuIcon } from '../assets/icons/MenuIcon';
import { ProfileIcon } from '../assets/icons/ProfileIcon';
import { ArrowLeft } from '../assets/icons/ArrowLeft';
import { ToggleSwitch } from '../assets/icons/ToggleSwitch';
import brandImageLight from '../assets/images/dev-projects-dark.png';
import brandImageDark from '../assets/images/dev-projects-logo.png';
import { memo, useCallback, useEffect, useRef } from 'react';
import {
  sidebarOpenAtom,
  dropDownOpenAtom,
  searchBoxAtom,
} from '../store/atoms/dashboardLayoutAtoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { colorThemeAtom } from '../store/atoms/themeAtoms';
const Imagesrc = 'https://avatars.githubusercontent.com/u/144588220?v=4';

const DashboardHeader = memo(() => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useRecoilState(searchBoxAtom);
  const toggleSearchBar = () => {
    setIsSearchBarOpen((prev) => !prev);
  };
  return (
    <header className="bg-white-light dark:border-b-black-light relative z-40 flex h-16 items-center justify-between gap-12 border-b-2 px-4 lg:px-6 dark:bg-black dark:text-white">
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
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, [setIsSidebarOpen]);
  const [isDropDownOpen, setDropDownOpen] = useRecoilState(dropDownOpenAtom);
  const profileButtonRef = useRef(null);
  const theme = useRecoilValue(colorThemeAtom);
  const setIsSearchBarOpen = useSetRecoilState(searchBoxAtom);
  const toggleSearchBar = () => {
    setIsSearchBarOpen((prev) => !prev);
  };

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
        <button className="hover:bg-white-medium dark:hover:bg-black-light focus:ring-primary cursor-pointer rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2">
          <NotificationIcon />
        </button>
        <button
          className="focus:ring-primary group relative min-w-max cursor-pointer rounded-full p-0.5 focus:outline-none focus:ring-2"
          ref={profileButtonRef}
          onClick={() => setDropDownOpen((prev) => !prev)}
        >
          {!Imagesrc ? (
            <img
              src={Imagesrc}
              alt="profile icon"
              className="h-9 w-9 rounded-full"
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
      </div>
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
          className="dark:bg-black-medium focus:border-primary border-black-light outline-black-light dark:border-primary h-full w-full rounded-bl-3xl rounded-tl-3xl border-2 pl-8 outline-none outline-offset-[-2px] focus:outline-none"
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
  const toggleTheme = useCallback(() => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

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
      <ul className="font-body flex flex-col gap-4 p-4 text-left text-sm">
        <li className="hover:bg-white-medium dark:hover:bg-black-light min-h-4 rounded-md">
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
      </ul>
    </div>
  );
};
export default DashboardHeader;
