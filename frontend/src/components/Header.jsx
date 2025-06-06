import { Link } from 'react-router-dom';
import NotificationIcon from '../assets/icons/notificationIcon';
import { MenuIcon } from '../assets/icons/MenuIcon';
import { ProfileIcon } from '../assets/icons/ProfileIcon';
import { InboxIcon } from '../assets/icons/InboxIcon';
import brandLogo from '../assets/images/dev-projects-logo.png';
import { memo, useCallback } from 'react';
import { sidebarOpenAtom } from '../store/atoms/dashboardLayoutAtoms';
import { useRecoilState } from 'recoil';

const DashboardHeader = memo(() => {
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(sidebarOpenAtom);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, [setIsSidebarOpen]);

  return (
    <header className="bg-white-light relative z-40 flex h-16 items-center justify-between border-b-2 px-4 lg:px-6">
      <div className="flex items-center gap-1.5 lg:gap-4">
        <button
          className="hover:bg-white-medium focus:ring-primary cursor-pointer rounded-sm p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
        <div className="max-h-12 w-32">
          <Link to="/">
            <img
              src={brandLogo}
              alt="Dev Projects logo"
              className="max-h-full object-contain"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-1 lg:gap-3">
        <button className="hover:bg-white-medium focus:ring-primary cursor-pointer rounded-sm p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2">
          <InboxIcon />
        </button>
        <button className="hover:bg-white-medium focus:ring-primary cursor-pointer rounded-sm p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2">
          <NotificationIcon />
        </button>
        <button className="focus:ring-primary cursor-pointer rounded-sm p-1.5 focus:outline-none focus:ring-2">
          <ProfileIcon />
        </button>
      </div>
    </header>
  );
});

export default DashboardHeader;
