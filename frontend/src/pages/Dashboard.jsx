import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useFetchData from '../hooks/useFetchData';
import { userProjectsAtom } from '../store/atoms/userProjects';
import DifficultyTag from '../components/projects/tags/DifficultyTag';
import DomainTag from '../components/projects/tags/DomainTag';
import StatusTag from '../components/projects/tags/StatusTag';
import ToolsTag from '../components/projects/tags/ToolsTag';
import { ListIcon } from '../assets/icons/List';
import SkeletalLoader from '../components/ui/SkeletalLoader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProjects, setUserProjects] = useRecoilState(userProjectsAtom);
  const { fetchData, loading, error } = useFetchData();

  const ProjectsLoadingIndicator = () => {
    return (
      <div className="bg-white-medium dark:bg-black-medium w-[90%] max-w-2xl p-2">
        <SkeletalLoader height="h-7">
          <SkeletalLoader height="h-8" width="w-[70%]" />
          <SkeletalLoader height="h-10" styles="mt-5" />
          <SkeletalLoader height="h-10" />
        </SkeletalLoader>
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
      <div className="bg-white-medium dark:bg-black-medium outline-black-dark mb-96 max-w-2xl rounded-lg p-3 md:p-5">
        <h1 className="font-heading mb-5 text-2xl font-medium tracking-wide">
          Started Projects
        </h1>
        <div>
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
      </div>
    );
  }
  if (!loading && !error && userProjects.length == 0) {
    return <NoProjectsStarted />;
  }
};
const ProjectCard = ({ project, status }) => {
  const navigate = useNavigate();
  function redirectToUserProject() {
    navigate(`/project/${project.id} `);
  }
  return (
    <div
      className="bg-white-light dark:bg-black-light outline-white-dark dark:outline-black-dark hover:outline-primary dark:hover:outline-primary duration-250 my-4 flex w-full max-w-2xl cursor-pointer rounded-md p-4 outline outline-2 transition-all hover:scale-[1.025] hover:shadow-md"
      onClick={redirectToUserProject}
    >
      <div className="w-full gap-1">
        <div className="mb-3 flex items-start justify-between sm:items-center md:mb-2 md:flex-row">
          <span className="font-heading w-max text-lg font-medium tracking-tight md:text-xl">
            {project.name}
          </span>
          <span>
            <StatusTag status={status} />
          </span>
        </div>
        <span className="text-md mb-5 line-clamp-2 w-[90%] opacity-75">
          {project.about}
        </span>
        <div className="flex items-center gap-2">
          <DifficultyTag difficulty={project.difficulty} />
          <DomainTag domain={project.domain} />
        </div>
        <div className="my-2 py-2">
          <ToolsTag tools={project.tools} />
        </div>
      </div>
    </div>
  );
};

const NoProjectsStarted = () => {
  const navigate = useNavigate();

  function goToProjectsPage() {
    navigate('/projects');
  }

  return (
    <div className="bg-white-medium dark:bg-black-medium m-4 rounded-lg p-3">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="dark:bg-black-light bg-white-dark mb-6 rounded-full p-6">
          <ListIcon />
        </div>
        <h2 className="font-heading dark:text-white-light mb-3 text-xl font-medium tracking-wide">
          No Projects Started Yet
        </h2>
        <p className="dark:text-white-medium mb-8 max-w-md text-balance opacity-80">
          Start buiding cool stuff by exploring our curated collection of
          projects designed to help you learn and grow your skills.
        </p>
        <button
          onClick={goToProjectsPage}
          className="bg-primary hover:bg-primary/90 duration-250 font-heading rounded-lg px-8 py-3 font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
        >
          Explore Projects
        </button>
      </div>
    </div>
  );
};
export default Dashboard;
