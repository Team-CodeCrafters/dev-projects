import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { projectDetailsAtom } from '../store/atoms/project';
import { useRecoilState } from 'recoil';
import LoadingPage from '../pages/LoadingPage';
import DifficultyTag from '../components/projects/tags/DifficultyTag';
import DomainTag from '../components/projects/tags/DomainTag';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import Button from '../components/ui/Button';
const DisplayProjectDetails = ({ project }) => {
  console.log(project);
  return (
    <>
      <div className="ml-2 flex flex-col gap-3">
        <div className="flex w-full flex-col justify-between gap-3 sm:w-[90%] sm:flex-row">
          <h1 className="font-heading inline flex-1 text-2xl font-medium tracking-wide">
            {project.name}
          </h1>
          <div className="flex gap-4">
            <DifficultyTag difficulty={project.difficulty} />
            <DomainTag domain={project.domain} />
          </div>
        </div>

        <div className="mt-4 flex gap-4 md:flex-row">
          <div className="shrink">
            <Button text={'Start Project'} />
          </div>
          <button className="font-body duration focus:outline-primary dark:hover:bg-black-medium box-content flex w-16 shrink items-center justify-between gap-2 rounded-md p-1 px-5 transition-all duration-200 hover:bg-gray-200 focus:scale-95">
            <BookmarkIcon size={'size-5'} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { fetchData, loading, error } = useFetchData();
  const [project, setProject] = useRecoilState(projectDetailsAtom);

  useEffect(() => {
    async function getProjectDetails() {
      const response = await fetchData(`/project/${id}`);

      if (response.success) {
        setProject(response.data.project);
      }
    }
    getProjectDetails();
  }, []);

  if (error) {
    return null;
  }
  if (loading) {
    return <LoadingPage />;
  }
  if (project) {
    return (
      <div className="bg-white-medium dark:bg-black-light m-1 rounded-lg p-4 md:m-2">
        <DisplayProjectDetails project={project} />
      </div>
    );
  }
};

export default ProjectDetails;
