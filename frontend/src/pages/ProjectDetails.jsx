import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import {
  BookmarkedProjectsAtom,
  projectDetailsAtom,
  projectDetailsTab,
  projectStartedSelector,
  similarProjectsAtom,
} from '../store/atoms/project';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import DifficultyTag from '../components/projects/tags/DifficultyTag';
import DomainTag from '../components/projects/tags/DomainTag';
import ToolsTag from '../components/projects/tags/ToolsTag';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import { ArrowLeft } from '../assets/icons/ArrowLeft';
import Button from '../components/ui/Button';
import NoContentToDisplay from '../components/ui/NoContent';
import ProjectCard from '../components/projects/ProjectCard';
import Loader from '../components/ui/Loader';
import { PopupNotification } from '../components/ui/PopupNotification';
import CreateAccountDialog from '../components/ui/CreateAccountDialog';
import { userProjectsAtom } from '../store/atoms/userProjects';

const ProjectDetails = () => {
  const { id } = useParams();
  const { fetchData: fetchProjectData, loading: loadingProject } =
    useFetchData();
  const { fetchData: fetchSimilarProjects } = useFetchData();
  const { fetchData: fetchUserProject, loading: loadingUserProject } =
    useFetchData();
  const [project, setProject] = useRecoilState(projectDetailsAtom);
  const [userProjects, setUserProjects] = useRecoilState(userProjectsAtom);
  const isProjectStarted = useRecoilValue(projectStartedSelector);

  useEffect(() => {
    async function getProjectDetails() {
      const response = await fetchProjectData(`/project/${id}`);
      if (response.success) {
        setProject(response.data.project);
        document.title = `Dev Projects | ${response.data.project.name}`;
      }
      return response.data.project;
    }

    async function getUserProjects() {
      const token = localStorage.getItem('token');
      if (!token) return null;
      if (userProjects.length) return userProjects;
      const options = {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const response = await fetchUserProject('/user-projects', options);
      if (response.success) {
        setUserProjects(response.data.projects);
        return response.data.projects;
      }
      return null;
    }

    async function fetchProject() {
      await getProjectDetails();
      await getUserProjects();
    }

    fetchProject();
  }, [id]);

  if (loadingProject || loadingUserProject) {
    return (
      <div className="grid h-full place-items-center">
        <div className="dark:bg-black-light bg-white-dark relative grid h-full w-full place-items-center rounded-lg p-2 pt-4 md:m-2 md:max-w-xl md:p-4 lg:max-w-3xl">
          <Loader height={'h-8'} width={'w-8'} primaryColor={true} />
        </div>
      </div>
    );
  }
  if (!loadingProject && !loadingUserProject && project) {
    return (
      <div className="grid h-full place-items-center">
        <div className="dark:bg-black-light bg-white-dark bg-red relative mx-auto flex h-full w-full flex-col rounded-lg p-2 pt-4 md:m-2 md:p-4 lg:max-w-3xl">
          <ProjectHeader
            projectId={project.id}
            isProjectStarted={isProjectStarted}
          />
          <TabsLayout />
          <ProjectContent />
        </div>
      </div>
    );
  }
};

const ProjectHeader = memo(({ projectId }) => {
  const navigate = useNavigate();
  const project = useRecoilValue(projectDetailsAtom);
  const setUserProject = useSetRecoilState(userProjectsAtom);
  const isProjectStarted = useRecoilValue(projectStartedSelector);
  const [hasProjectStarted, setHasProjectStarted] = useState(false);
  const StartProjectButton = () => {
    const { fetchData, loading, error } = useFetchData();

    async function handleStartProject() {
      const token = localStorage.getItem('token');
      const options = {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      };
      const response = await fetchData('/user-projects/create', options);

      if (response.success) {
        setHasProjectStarted(true);
        const project = response.data.userProject;
        setUserProject((prev) => [...prev, project]);
      }
    }

    async function handleProjectSubmission() {
      navigate(`/submit/${project.id}`);
    }

    return (
      <div className="min-w-32">
        {!!error &&
          (error === 'Request failed' ? (
            <CreateAccountDialog />
          ) : (
            <PopupNotification type="error" text={error} />
          ))}
        {!!hasProjectStarted && (
          <PopupNotification type="success" text={'project started!'} />
        )}

        {isProjectStarted ? (
          <Button
            onClick={handleProjectSubmission}
            text={loading ? <Loader /> : 'Submit'}
          />
        ) : (
          <Button
            onClick={handleStartProject}
            text={loading ? <Loader /> : 'start project'}
          />
        )}
      </div>
    );
  };

  const BookmarkButton = () => {
    const { fetchData, data: bookmarkData, loading, error } = useFetchData();
    const addBookmark = useSetRecoilState(BookmarkedProjectsAtom);
    async function handleBookmark() {
      const token = localStorage.getItem('token');
      const options = {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      };

      const response = await fetchData('/bookmark/', options);
      if (response.success) {
        const newBookmark = response.data.bookmark;
        addBookmark((prev) => ({ ...prev, newBookmark }));
      }
    }

    return (
      <>
        {!!bookmarkData && (
          <PopupNotification type="success" text={bookmarkData.message} />
        )}
        {!!error &&
          (error === 'Request failed' ? (
            <CreateAccountDialog />
          ) : (
            <PopupNotification type="info" text={error} />
          ))}
        <button
          onClick={handleBookmark}
          disabled={loading}
          className="font-body duration focus:outline-primary dark:hover:bg-black-medium box-content flex w-16 shrink items-center justify-center gap-2 rounded-md p-1 px-3 transition-all duration-200 hover:bg-gray-200 focus:scale-95 disabled:opacity-50 md:px-5"
        >
          {loading ? (
            <Loader height={'h-5'} width={'w-5'} />
          ) : (
            <>
              <BookmarkIcon size={'md:size-5 size-4'} />
              <span>Save</span>
            </>
          )}
        </button>
      </>
    );
  };

  return (
    <>
      <div className="ml-2 flex flex-col gap-3">
        <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row">
          <h1 className="font-heading inline flex-1 text-2xl font-medium tracking-wide">
            {project.name}
          </h1>
          <div className="flex gap-4">
            <DifficultyTag difficulty={project.difficulty} />
            <DomainTag domain={project.domain} />
          </div>
        </div>
        <div className="max-w-sm">
          <ToolsTag tools={project.tools} />
        </div>
        <div className="mt-4 flex gap-4 md:flex-row">
          <StartProjectButton />
          <BookmarkButton />
        </div>
      </div>
    </>
  );
});

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
          className={`bg-primary duration-450 absolute left-0 top-0 h-[2px] w-32 transition-all ${
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

const ProjectContent = () => {
  const activeTab = useRecoilValue(projectDetailsTab);
  const project = useRecoilValue(projectDetailsAtom);
  return (
    <section className="mt-3 rounded-md transition-all">
      {activeTab === 'get-started' && <ProjectInformation project={project} />}
      {activeTab === 'submissions' && <Submissions />}
      {activeTab === 'discussions' && <Discussions />}
    </section>
  );
};

const ProjectInformation = ({ project }) => {
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
      <div className="max-w-fit rounded-md p-3">
        <h2 className="font-heading text-xl font-semibold">Challenges</h2>
        <ul className="my-2 list-disc pl-4 text-sm">
          {project.challenges.map((challenge, index) => (
            <li key={index}>{challenge}</li>
          ))}
        </ul>
      </div>
      <SimilarProjectsList />
    </div>
  );
};

const SimilarProjectsList = () => {
  const navigate = useNavigate();
  const { fetchData } = useFetchData();
  const project = useRecoilValue(projectDetailsAtom);
  const [similarProjects, setSimilarProjects] =
    useRecoilState(similarProjectsAtom);
  useEffect(() => {
    async function getSimilarProjects() {
      const response = await fetchData(
        `/project/recommend?domain=${project.domain}&difficulty=${project.difficulty}&excludeIds=${project.id}`,
      );

      if (response.success) {
        setSimilarProjects([
          ...response.data.recommendedprojects,
          ...response.data.similarProjects,
        ]);
      }
    }
    getSimilarProjects();
  }, []);

  function handleProjectClick(id) {
    navigate(`/project/${id}`);
  }

  if (!similarProjects) return null;
  return (
    <>
      <h2 className="font-heading ml-3 mt-3 place-self-start text-xl font-medium tracking-wide md:text-2xl">
        Similar Projects
      </h2>
      <div className="flex flex-wrap justify-center gap-1 md:justify-start">
        {similarProjects.map((project) => (
          <ProjectCard
            key={project.id}
            styles={'sm:max-w-[20rem]  w-full mx-2 h-2xl pt-6'}
            project={project}
            onClick={() => handleProjectClick(project.id)}
          >
            <span className="invisible absolute right-1 top-1 rotate-[135deg] p-1 opacity-80 transition-[visiblity] group-hover:visible">
              <ArrowLeft />
            </span>
          </ProjectCard>
        ))}
      </div>
    </>
  );
};

const Discussions = () => {
  const [comment, setComment] = useState('');
  function postComment() {
    console.log("post the user's comment");
  }
  return (
    <>
      <div className="mb-4 mt-2 max-w-prose">
        <label className="focus-within:border-primary border-b-2 border-gray-400 pb-1 transition-all">
          <textarea
            type="text"
            name="comment"
            id="discussion-comment"
            placeholder={'Add a comment'}
            rows="1"
            className="custom-scrollbar field-sizing-content w-full resize-none border-none bg-transparent pl-1 outline-none placeholder:text-black placeholder:opacity-80 dark:placeholder:text-white"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </label>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => {
              setComment('');
            }}
            className="hover:bg-white-medium dark:hover:bg-black-medium rounded-full p-3 px-4 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={postComment}
            className="bg-black-lighter/90 hover:bg-black-lighter hover :scale-10 dark:bg-black-neutral rounded-full p-2 px-5 text-sm text-white transition-transform"
          >
            Post
          </button>
        </div>
      </div>
      <NoContentToDisplay />
    </>
  );
};

const Submissions = () => {
  console.log('rendered submissions');

  return <NoContentToDisplay />;
};

export default ProjectDetails;
