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
    <div className="h-full w-full overflow-hidden border-r-2 pt-4">
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
    <Link to={href}>
      <li
        className={`bg-white-medium font-heading m-2 mt-4 flex cursor-pointer items-center justify-start gap-4 rounded-md p-3 transition-all duration-300 ease-in-out hover:bg-gray-100`}
      >
        <div className="flex flex-shrink-0 items-center justify-center">
          <Icon />
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

export default DashboardSidebar;
