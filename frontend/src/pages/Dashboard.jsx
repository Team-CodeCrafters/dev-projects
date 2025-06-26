import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useFetchData from '../hooks/useFetchData';
import { userProjectsAtom } from '../store/atoms/userProjects';
import Status from '../components/projects/tags/StatusTag';
import DifficultyTag from '../components/projects/tags/DifficultyTag';
import DomainTag from '../components/projects/tags/DomainTag';
import StatusTag from '../components/projects/tags/StatusTag';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProjects, setUserProjects] = useRecoilState(userProjectsAtom);
  const { fetchData, loading, error } = useFetchData();

  const ProjectsLoadingIndicator = () => {
    return (
      <div className="dark:bg-black-neutral w-[90%] max-w-xl rounded-md bg-gray-50 outline outline-gray-300 lg:ml-10 dark:outline-black">
        <div
          className="flex w-full animate-pulse flex-col p-4"
          style={{ animationDuration: '1000ms' }}
        >
          <div className="flex justify-between">
            <div className="dark:bg-black-light h-6 w-52 max-w-[45%] rounded-full bg-gray-200"></div>
            <div className="flex justify-end gap-1 md:gap-2">
              <div className="dark:bg-black-light mb-4 h-6 w-36 max-w-[35%] rounded-full bg-gray-200"></div>
              <div className="dark:bg-black-light h-6 w-20 max-w-[30%] rounded-full bg-gray-200"></div>
            </div>
          </div>
          <div className="dark:bg-black-light mb-3 h-5 w-[80%] max-w-sm rounded-full bg-gray-200"></div>
          <div className="dark:bg-black-light mb-2 h-5 w-[80%] max-w-sm rounded-full bg-gray-200"></div>
          <div className="dark:bg-black-light h-5 w-[80%] max-w-sm rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signup');
      return;
    }

    async function getStartedProjects() {
      if (userProjects.length) return null;
      const options = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = await fetchData('/user-projects', options);
      if (response.success) {
        setUserProjects(response.data.projects);
      }
    }
    getStartedProjects();
  }, []);

  if (error) {
    console.log(error);
    return null;
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center md:justify-start">
        <ProjectsLoadingIndicator />
      </div>
    );
  }
  if (userProjects.length > 0) {
    return (
      <div className="bg-white-medium dark:bg-black-neutral outline-black-dark max-w-2xl rounded-md p-4 md:ml-5">
        <h1 className="font-heading mb-5 text-2xl font-medium tracking-wide">
          Started Projects
        </h1>
        {userProjects.map((userProject) => (
          <ProjectCard
            key={userProject.id}
            status={userProject.status}
            estimatedTime={userProject.estimatedTime}
            startedAt={userProject.startedAt}
            project={userProject.project}
          />
        ))}
      </div>
    );
  }
  if (!loading && !error && userProjects.length == 0) {
    return <div>you have not started any project yet</div>;
  }
};
const ProjectCard = ({ project, status, startedAt }) => {
  return (
    <div className="dark:outline-black-light bg-white-light dark:bg-black-light outline-white-dark flex w-full max-w-2xl rounded-md p-4 outline outline-2 sm:p-4">
      <div className="mb-2 w-full gap-1">
        <div className="mr-3 flex flex-col items-start justify-between md:flex-row md:items-center">
          <span className="font-heading w-max text-xl font-medium tracking-tight">
            {project.name}
          </span>
          <span>
            <StatusTag status={status} />
          </span>
        </div>
        <span className="mb-5 line-clamp-2 w-[90%] opacity-75">
          {project.about}
        </span>
        <div className="flex items-center gap-2">
          <DifficultyTag difficulty={project.difficulty} />
          <DomainTag domain={project.domain} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
