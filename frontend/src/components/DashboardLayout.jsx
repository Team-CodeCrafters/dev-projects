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
  }, [setIsExpanded]);

  return (
    <div className="flex h-screen flex-col">
      {console.log(isExpanded)}
      <DashboardHeader />
      <div className="relative flex flex-1 justify-start overflow-hidden">
        <div
          className={`relative z-10 flex-shrink-0 bg-white transition-all duration-300 ease-in-out ${
            screenSize.width < 768
              ? isExpanded
                ? 'w-64 translate-x-0'
                : 'w-0 -translate-x-full'
              : isExpanded
                ? 'w-64'
                : 'w-16'
          } `}
        >
          <DashboardSidebar />
        </div>

        <div className="min-h-screen flex-1 overflow-auto bg-white pl-2 pt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
