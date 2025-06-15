import { Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import DashboardHeader from './Header';
import DashboardSidebar from './Sidebar';
import { sidebarOpenAtom } from '../store/atoms/dashboardLayoutAtoms';
import useScreenSize from '../hooks/useScreenSize';
import { useEffect } from 'react';

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useRecoilState(sidebarOpenAtom);
  const screenSize = useScreenSize();

  useEffect(() => {
    screenSize.width > 768 ? setIsExpanded(true) : setIsExpanded(false);
  }, [screenSize]);

  return (
    <div className="dark:bg-black-medium flex h-screen w-screen flex-col">
      <DashboardHeader />
      <div className="relative flex flex-1 justify-start overflow-hidden">
        <div
          className={`bg-white-light dark:bg-black-medium dark:border-r-black-light z-10 h-full flex-shrink-0 border-r-2 transition-all duration-300 ease-in-out ${
            screenSize.width < 768
              ? isExpanded
                ? 'fixed w-56 translate-x-0'
                : 'fixed w-0 -translate-x-full transition-all dark:border-r-transparent'
              : isExpanded
                ? 'w-56'
                : 'w-16'
          } `}
        >
          <DashboardSidebar />
        </div>

        <div className="dark:bg-black-medium min-h-screen flex-1 overflow-auto bg-white pl-2 pt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
