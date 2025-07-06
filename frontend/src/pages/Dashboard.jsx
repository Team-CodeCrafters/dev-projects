import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useFetchData from '../hooks/useFetchData';
import { userProjectsAtom } from '../store/atoms/userProjects';
import { ListIcon } from '../assets/icons/List';
import SkeletalLoader from '../components/ui/SkeletalLoader';
import ProjectCard from '../components/projects/ProjectCard';

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
    document.title = 'Dev Projects | Dashboard';
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
        <h1 className="font-heading mb-5 text-xl font-medium tracking-wide md:text-2xl">
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
