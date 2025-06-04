import NotificationIcon from '../assets/notificationIcon';
import ProfilePicture from './ProfilePicture';

const DashboardNavigation = () => {
  return (
    <>
      <header className="fixed left-52 right-0 top-0 z-10 flex h-16 justify-between bg-white px-3 shadow-md">
        <ul className="flex flex-auto list-none justify-around gap-4">
          <li>
            <a href="/projects" className="text-black-light text-lg font-bold">
              Projects
            </a>
          </li>
          <li>
            <a href="/projects" className="text-black-medium text-lg font-bold">
              Solutions
            </a>
          </li>
          <li>
            <a href="/projects" className="text-black-dark text-lg font-bold">
              bookmarks
            </a>
          </li>
        </ul>

        <div>
          <span>
            <NotificationIcon />
          </span>
          <span>
            <ProfilePicture />
          </span>
        </div>
      </header>
    </>
  );
};

export default DashboardNavigation;
