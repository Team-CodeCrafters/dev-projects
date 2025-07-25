import { useEffect } from 'react';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../ui/Loader';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  projectDetailsAtom,
  projectSubmissionsAtomFamily,
} from '../../store/atoms/project';
import { ProfileIcon } from '../../assets/icons/ProfileIcon';
import { formatDate } from '../../utils/formatters';
import NoContentToDisplay from '../ui/NoContent';
const Submissions = () => {
  const { fetchData, loading } = useFetchData();
  const project = useRecoilValue(projectDetailsAtom);
  const [projectSubmissions, setProjectSubmissions] = useRecoilState(
    projectSubmissionsAtomFamily(project.id),
  );
  useEffect(() => {
    if (projectSubmissions) {
      return;
    }

    async function fetchSubmissions() {
      const response = await fetchData(`/submissions/all/${project.id}`);
      setProjectSubmissions(response.data?.submissions);
    }
    fetchSubmissions();
  }, [project.id]);

  if ((loading || loading === undefined) && !projectSubmissions) {
    return (
      <div className="grid h-full place-items-center">
        <Loader primaryColor={true} />
      </div>
    );
  }
  if (projectSubmissions && projectSubmissions.length > 0) {
    return (
      <div className="flex flex-col items-center">
        {projectSubmissions.map((submission) => (
          <Submission
            key={submission.id}
            project={submission}
            user={submission.user}
          />
        ))}
      </div>
    );
  } else {
    return (
      <NoContentToDisplay
        heading={'No submissions yet!'}
        body={'projects submit by users are displayed here'}
      />
    );
  }
};

const Submission = ({ project, user }) => {
  return (
    <div
      className={`bg-white-light dark:bg-black-light dark:outline-black-dark hover:outline-primary dark:hover:outline-primary duration-250 group relative my-2 mb-2 flex w-[95%] max-w-2xl cursor-pointer flex-col gap-1 rounded-md p-4 outline outline-2 outline-neutral-400 transition-all duration-500 hover:shadow-md md:my-2 md:w-full`}
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
      <div className="w-full text-sm opacity-85">{project.description}</div>
    </div>
  );
};
export default Submissions;
