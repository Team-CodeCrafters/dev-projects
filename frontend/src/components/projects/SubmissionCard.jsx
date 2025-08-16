import { formatDate } from '../../utils/formatters';
import { ProfileIcon } from '../../assets/icons/ProfileIcon';
import { Link } from 'react-router-dom';
import LinkIcon from '../../assets/icons/Link';
import ToolsTag from './tags/ToolsTag';

const SubmissionCard = ({ project, user }) => {
  return (
    <div
      className={`bg-white-light dark:bg-black-light dark:outline-black-dark hover:outline-primary dark:hover:outline-primary duration-250 group relative my-2 mb-2 flex h-full w-[95%] max-w-2xl cursor-pointer flex-col gap-1 rounded-md p-4 outline outline-2 outline-neutral-400 transition-all duration-500 hover:shadow-md md:my-2 md:w-full`}
    >
      <div className="flex gap-2">
        <span className="focus:ring-primary group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full outline-none focus:ring-2">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="profile icon"
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <ProfileIcon />
          )}
        </span>
        <div className="flex flex-col">
          <b className="font-heading flex-grow text-center text-sm">
            {user.username}
          </b>
          {user.displayName && (
            <span className="relative -top-1 left-[2px] text-xs opacity-70">
              {user.displayName}
            </span>
          )}
        </div>
        <span className="ml-auto text-xs opacity-70">
          {formatDate(project.createdAt)}
        </span>
      </div>
      <div className="font-heading mt-2 w-full font-medium">
        {project.title}
      </div>
      <div className="mb-4 w-full text-sm opacity-85">
        {project.description}
      </div>
      {project.tools && project.tools.length > 0 && (
        <ToolsTag tools={project.tools} />
      )}

      <div className="flex gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        {console.log(project)}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            className="flex items-center gap-2 rounded-2xl p-1 px-2 text-sm text-blue-600 outline outline-2 transition-colors hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            <LinkIcon size="size-5" />
            View Site
          </a>
        )}

        {project.githubRepo && (
          <a
            href={project.githubRepo}
            target="_blank"
            className="flex items-center gap-2 rounded-2xl p-1 px-2 text-sm text-gray-600 outline outline-1 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Source Code
          </a>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
