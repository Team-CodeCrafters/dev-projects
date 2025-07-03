import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { projectDetailsAtom, projectDetailsTab } from '../store/atoms/project';
import { useRecoilState, useRecoilValue } from 'recoil';
import LoadingPage from '../pages/LoadingPage';
import DifficultyTag from '../components/projects/tags/DifficultyTag';
import DomainTag from '../components/projects/tags/DomainTag';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import Button from '../components/ui/Button';

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
      <div className="bg-white-medium dark:bg-black-light relative m-auto flex flex-col rounded-lg p-2 pt-6 sm:w-full md:m-2 md:max-w-4xl md:p-4">
        <DisplayProjectDetails />
        <TabsLayout />
        <ProjectInformation />
      </div>
    );
  }
};

const DisplayProjectDetails = () => {
  const project = useRecoilValue(projectDetailsAtom);
  return (
    <>
      <div className="ml-2 flex flex-col gap-3">
        <div className="flex w-full flex-col justify-between gap-3 sm:flex-row">
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
          <button className="font-body duration focus:outline-primary dark:hover:bg-black-medium box-content flex w-16 shrink items-center justify-end gap-2 rounded-md p-1 px-3 transition-all duration-200 hover:bg-gray-200 focus:scale-95 md:px-5">
            <BookmarkIcon size={'md:size-5 size-4 '} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </>
  );
};

const TabsLayout = () => {
  const activeTab = useRecoilValue(projectDetailsTab);
  return (
    <div className="custom-scrollbar scrollbar-thin mt-7 w-full self-center overflow-x-auto md:max-w-max md:self-auto">
      <ul className="border-black-lighter flex min-w-max border-b border-opacity-40 dark:border-black">
        <TabElement text={'Get Started'} currentTab={'get-started'} />
        <TabElement text={'Discussions'} currentTab={'discussions'} />
        <TabElement text={'Submissions'} currentTab={'submissions'} />
      </ul>

      <div className="relative h-[2px] w-full">
        <div
          className={`bg-primary absolute left-0 top-0 h-[2px] w-32 transition-all ${
            activeTab === 'discussions'
              ? 'left-32'
              : activeTab === 'submissions'
                ? 'left-64'
                : ''
          }`}
        ></div>
      </div>
    </div>
  );
};

const TabElement = ({ text, currentTab }) => {
  const [currentActiveTab, setCurrentActiveTab] =
    useRecoilState(projectDetailsTab);
  return (
    <li className="flex cursor-pointer select-none">
      <label className="dark:bg-black-light dark:hover:bg-black-lighter hover:bg-white-dark has-[:checked]:text-primary w-32 cursor-pointer rounded-md p-2 px-4 text-center font-semibold outline outline-transparent transition-colors has-[:checked]:outline">
        <input
          type="radio"
          name="project-tab"
          value={text}
          className="sr-only"
          checked={currentTab === currentActiveTab}
          onChange={() => setCurrentActiveTab(currentTab)}
        />
        {text}
      </label>
    </li>
  );
};

const ProjectInformation = () => {
  const activeTab = useRecoilValue(projectDetailsTab);

  return (
    <section className="mt-5">
      {activeTab === 'get-started' && <AboutProject />}
      {activeTab === 'submissions' && <Submissions />}
      {activeTab === 'discussions' && <Discussions />}
    </section>
  );
};

const AboutProject = () => {
  const project = useRecoilValue(projectDetailsAtom);
  console.log(project);
  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-fit rounded-md p-3">
        <h2 className="font-heading text-xl font-semibold">About</h2>
        <p className="text-pretty text-sm opacity-90 md:max-w-prose">
          {project.about}
        </p>
      </div>
      <div className="max-w-fit rounded-md p-3">
        <h2 className="font-heading text-xl font-semibold">Requirements</h2>
        <ul className="my-2 list-disc pl-4 text-sm">
          {project.requirement.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Submissions = () => {
  console.log('rendered submissions');

  return <div>Submissions</div>;
};

const Discussions = () => {
  console.log('rendered discussions');
  return <div className="h-[200vh]">Discussions</div>;
};
export default ProjectDetails;
