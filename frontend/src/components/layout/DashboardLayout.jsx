import { Outlet } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import DashboardHeader from './Header';
import DashboardSidebar from './Sidebar';
import { sidebarOpenAtom } from '../../store/atoms/dashboardLayoutAtoms';
import { createAccountDialogAtom } from '../../store/atoms/dialog';
import useScreenSize from '../../hooks/useScreenSize';
import { useEffect } from 'react';
import { PopupNotification } from '../ui/PopupNotification';
import CreateAccountDialog from '../../components/ui/CreateAccountDialog';
const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useRecoilState(sidebarOpenAtom);
  const screenSize = useScreenSize();

  useEffect(() => {
    screenSize.width > 768 ? setIsExpanded(true) : setIsExpanded(false);
  }, [screenSize]);

  const ShowCreateAccount = () => {
    const showAccountDialog = useRecoilValue(createAccountDialogAtom);

    return !!showAccountDialog && <CreateAccountDialog />;
  };

  return (
    <div className="dark:bg-black-medium flex h-screen w-screen flex-col">
      <DashboardHeader />
      <div className="relative flex w-[100vw] flex-1 justify-start overflow-hidden">
        <div
          className={`bg-white-light dark:bg-black-medium dark:border-r-black-light z-10 h-full flex-shrink-0 border-r-2 transition-all duration-150 ease-in-out ${
            screenSize.width < 768
              ? isExpanded
                ? 'fixed w-56 translate-x-0'
                : 'fixed -translate-x-full dark:border-r-transparent'
              : isExpanded
                ? 'w-56'
                : 'w-16'
          } `}
        >
          <DashboardSidebar />
        </div>
        <div
          className={`dark:bg-black-medium custom-scrollbar scrollbar-gutter-stable h-full w-full items-center justify-center overflow-auto bg-white pt-3 transition-all md:pt-6 dark:text-white ${
            screenSize.width < 768 && isExpanded
              ? `pointer-events-none opacity-80 blur-sm`
              : ''
          }`}
        >
          <Outlet />
        </div>
      </div>
      <PopupNotification />
      <ShowCreateAccount />
    </div>
  );
};

export default DashboardLayout;
