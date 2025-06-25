import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { HomeIcon } from '../assets/icons/Home';
import { ListIcon } from '../assets/icons/List';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import { CircleCheckIcon } from '../assets/icons/CircleCheck';
import { memo, useEffect } from 'react';
import {
  screenSizeAtom,
  sidebarOpenAtom,
} from '../store/atoms/dashboardLayoutAtoms';
import { Link, useLocation } from 'react-router-dom';
import { useRef } from 'react';

const DashboardSidebar = memo(() => {
  const screensize = useRecoilValue(screenSizeAtom);
  const [isExpanded, setIsExpanded] = useRecoilState(sidebarOpenAtom);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isExpanded || screensize.width > 768) return;

    function checkMouseClick(e) {
      if (isExpanded && !sidebarRef?.current?.contains(e.target)) {
        setIsExpanded(false);
      }
    }

    /* adding delay to event listener for menu button in header to complete the event bubbling
     */
    let timeoutId = setTimeout(() => {
      document.body.addEventListener('click', checkMouseClick);
    }, 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.body.removeEventListener('click', checkMouseClick);
    };
  }, [screensize.width, isExpanded]);

  return (
    <div className="h-full w-full pt-4" ref={sidebarRef}>
      <ul>
        <SidebarElement Icon={HomeIcon} name="Dashboard" href={'/dashboard'} />
        <SidebarElement Icon={ListIcon} name="Projects" href={'/projects'} />
        <SidebarElement
          Icon={BookmarkIcon}
          name="Bookmarks"
          href={'/bookmarks'}
        />
        <SidebarElement
          Icon={CircleCheckIcon}
          name="Submissions"
          href={'/submissions'}
        />
      </ul>
    </div>
  );
});

const SidebarElement = ({ Icon, name, href }) => {
  const isExpanded = useRecoilValue(sidebarOpenAtom);
  const location = useLocation();

  return (
    <li className="relative">
      <Link to={href} className="peer">
        <div
          className={`font-heading dark:hover:bg-black-light m-2 mt-4 flex cursor-pointer items-center justify-start gap-4 rounded-md p-3 transition-all duration-300 ease-in-out hover:bg-gray-100 ${
            location.pathname === '/' + name.toLowerCase()
              ? 'text-primary dark:text-primary bg-white-dark dark:bg-black-light'
              : 'dark:text-white-light'
          }`}
        >
          <div className="flex flex-shrink-0 items-center justify-center">
            <Icon />
          </div>
          <span
            className={`ml-2 text-inherit transition-all duration-300 ease-in-out ${
              isExpanded ? 'opacity-100' : 'overflow-hidden opacity-0'
            }`}
          >
            {name}
          </span>
        </div>
      </Link>
      {!isExpanded && <ToolTip text={name} />}
    </li>
  );
};

const ToolTip = ({ text }) => (
  <div className="bg-black-light dark:bg-white-light pointer-events-none invisible absolute left-full top-1/2 z-50 -translate-y-1/2 translate-x-0 rounded-md px-4 py-2 text-white opacity-0 outline-none transition-all duration-300 ease-in-out peer-hover:visible peer-hover:translate-x-4 peer-hover:opacity-100 peer-focus-visible:visible peer-focus-visible:translate-x-4 peer-focus-visible:opacity-100 dark:text-black">
    {text}
    <div className="dark:border-r-white-light border-r-black-light absolute right-full top-1/2 h-0 w-0 -translate-y-1/2 border-y-8 border-l-0 border-r-8 border-transparent"></div>
  </div>
);

export default DashboardSidebar;
