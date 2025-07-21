import { useEffect } from 'react';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../ui/Loader';
import { useRecoilState } from 'recoil';
import { projectSubmissionsAtom } from '../../store/atoms/project';
import { ProfileIcon } from '../../assets/icons/ProfileIcon';
import { formatDistanceToNow } from 'date-fns';
import NoContentToDisplay from '../ui/NoContent';
const Submissions = ({ project }) => {
  const { fetchData, loading } = useFetchData();
  const [projectSubmissions, setProjectSubmissions] = useRecoilState(
    projectSubmissionsAtom,
  );
  useEffect(() => {
    async function fetchSubmissions() {
      const response = await fetchData(`/submissions/all/${project.id}`);
      console.log(response.data);
      if (response.success) {
        setProjectSubmissions(response.data.submissions);
      }
    }
    fetchSubmissions();
  }, [project.id]);

  if (loading || loading === undefined) {
    return (
      <div className="grid h-full place-items-center">
        <Loader primaryColor={true} />
      </div>
    );
  }

  if (projectSubmissions && projectSubmissions.length > 0) {
    console.log(projectSubmissions);
    return projectSubmissions.map((submission) => (
      <Submission
        key={submission.id}
        project={submission}
        user={submission.user}
      />
    ));
  } else {
    return <NoContentToDisplay text={'No submissions yet!'} />;
  }
};

const Submission = ({ project, user }) => {
  return (
    <div
      className={`bg-white-light dark:bg-black-light outline-white-dark dark:outline-black-dark hover:outline-primary dark:hover:outline-primary duration-250 group relative my-2 mb-2 flex w-[95%] max-w-2xl cursor-pointer flex-col gap-1 rounded-md p-4 py-2 outline outline-2 transition-all duration-500 hover:shadow-md md:my-2 md:w-full`}
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
          {formatDistanceToNow(new Date(project.createdAt), {
            addSuffix: true,
          })}
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
