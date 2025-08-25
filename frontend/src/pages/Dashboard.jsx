import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useFetchData from '../hooks/useFetchData';
import { userProjectsAtom } from '../store/atoms/userProjects';
import { ListIcon } from '../assets/icons/List';
import SkeletalLoader from '../components/ui/SkeletalLoader';
import ProjectCard from '../components/projects/ProjectCard';
import NoContentToDisplay from '../components/ui/NoContent';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProjects, setUserProjects] = useRecoilState(userProjectsAtom);
  const { fetchData, loading, error } = useFetchData();

  const ProjectsLoadingIndicator = () => {
    return (
      <div className="bg-white-medium dark:bg-black-medium w-[90%] max-w-2xl p-2">
        <SkeletalLoader height="h-12" width="w-[70%]" />
        <SkeletalLoader height="h-56" styles="mt-5" />
        <SkeletalLoader height="h-56" />
      </div>
    );
  };

  useEffect(() => {
    document.title = 'Dev Projects | Dashboard';
    const token = localStorage.getItem('token');
    const guestAccount = localStorage.getItem('guest-account');
    if (!token && !guestAccount) {
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
              href={`/project/${userProject.project.id}`}
            />
          ))}
        </div>
      </div>
    );
  }
  if (loading || loading === undefined) {
    return (
      <div className="flex max-w-2xl items-center justify-center md:justify-start">
        <ProjectsLoadingIndicator />
      </div>
    );
  }

  if (!loading && !error && userProjects.length == 0) {
    return (
      <NoContentToDisplay
        Icon={ListIcon}
        heading={'No Projects Started Yet'}
        body={
          'Start buiding cool stuff by exploring our curated collection of projects designed to help you learn and grow your skills.'
        }
        buttonText={'explore Projects'}
        href={'/projects'}
      />
    );
  }
};

export default Dashboard;
