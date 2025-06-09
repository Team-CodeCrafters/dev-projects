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
    <div className="dark:bg-black-dark flex h-screen w-screen flex-col">
      <DashboardHeader />
      <div className="relative flex flex-1 justify-start overflow-hidden">
        <div
          className={`bg-white-light dark:bg-black-dark relative z-10 flex-shrink-0 border-r-2 transition-all duration-300 ease-in-out ${
            screenSize.width < 768
              ? isExpanded
                ? 'absolute w-56 translate-x-0'
                : 'w-0 -translate-x-full dark:border-r-transparent'
              : isExpanded
                ? 'border-r-black-light w-56 bg-red-400'
                : 'w-16'
          } `}
        >
          <DashboardSidebar />
        </div>

        <div className="dark:bg-black-dark min-h-screen flex-1 overflow-auto bg-white pl-2 pt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
