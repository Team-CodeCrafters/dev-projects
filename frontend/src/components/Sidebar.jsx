import { useRecoilValue } from 'recoil';
import { HomeIcon } from '../assets/icons/Home';
import { ListIcon } from '../assets/icons/List';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import { CircleCheckIcon } from '../assets/icons/CircleCheck';
import { memo } from 'react';
import { sidebarOpenAtom } from '../store/atoms/dashboardLayoutAtoms';
import { Link } from 'react-router-dom';

const DashboardSidebar = memo(() => {
  return (
    <div className="h-full w-full overflow-hidden border-r-[inherit] pt-4 dark:border-r-[inherit]">
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
  return (
    <Link to={href} className="group">
      <li className="bg-white-medium font-heading dark:hover:bg-black-light dark:bg-black-dark dark:text-white-light m-2 mt-4 flex cursor-pointer items-center justify-start gap-4 rounded-md p-3 transition-all duration-300 ease-in-out hover:bg-gray-100">
        <div className="flex flex-shrink-0 items-center justify-center">
          <Icon />
          {!isExpanded && <ToolTip text={name} />}
        </div>
        <span
          className={`ml-2 transition-all duration-300 ease-in-out ${
            isExpanded ? 'opacity-100' : 'overflow-hidden opacity-0'
          } `}
        >
          {name}
        </span>
      </li>
    </Link>
  );
};

const ToolTip = ({ text }) => {
  return (
    <div className="bg-black-light invisible absolute left-[100%] z-30 rounded-md px-4 py-2 text-white opacity-0 transition-all duration-500 ease-out group-hover:visible group-hover:left-[120%] group-hover:opacity-100 group-focus:visible group-focus:left-[120%] group-focus:opacity-100 dark:bg-gray-300 dark:text-black">
      {text}
      <div className="dark:dark-black border-r-black-light absolute right-full top-1/2 h-0 w-0 -translate-y-1/2 border-y-8 border-l-0 border-r-8 border-transparent dark:border-r-gray-300"></div>
    </div>
  );
};

export default DashboardSidebar;
