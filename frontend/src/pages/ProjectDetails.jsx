import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import {
  BookmarkedProjectsAtom,
  projectDetailsActiveTab,
  projectDetailsAtom,
  projectStartedSelector,
  similarProjectsAtom,
} from '../store/atoms/project';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import DifficultyTag from '../components/projects/tags/DifficultyTag';
import DomainTag from '../components/projects/tags/DomainTag';
import ToolsTag from '../components/projects/tags/ToolsTag';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import SettingIcon from '../assets/icons/Setting';
import { ArrowLeft } from '../assets/icons/ArrowLeft';
import Button from '../components/ui/Button';
import ProjectCard from '../components/projects/ProjectCard';
import Loader from '../components/ui/Loader';
import { userProjectsAtom } from '../store/atoms/userProjects';
import usePopupNotication from '../hooks/usePopup';
import { createAccountDialogAtom } from '../store/atoms/dialog';
import Submissions from '../components/projects/Submissions';
import TabsLayout from '../components/layout/TabsLayout';
import Discussions from '../components/projects/Discussions';

const ProjectDetails = () => {
  const { id } = useParams();
  const { fetchData: fetchProjectData, loading: loadingProject } =
    useFetchData();
  const { fetchData: fetchUserProject, loading: loadingUserProject } =
    useFetchData();
  const [project, setProject] = useRecoilState(projectDetailsAtom);
  const [userProjects, setUserProjects] = useRecoilState(userProjectsAtom);
  const isProjectStarted = useRecoilValue(projectStartedSelector);
  const showPopup = usePopupNotication();
  useEffect(() => {
    async function getProjectDetails() {
      const response = await fetchProjectData(`/project/${id}`);
      if (response.success) {
        setProject(response.data.project);
        document.title = `Dev Projects | ${response.data.project.name}`;
      } else {
        showPopup('error', response.error);
      }

      return response.data?.project;
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
      <div className="dark:bg-black-light bg-white-dark grid h-full place-items-center">
        <div className="relative grid h-full w-full place-items-center rounded-lg p-2 sm:pt-4 md:m-2 md:p-4 lg:max-w-3xl">
          <Loader height={'h-8'} width={'w-8'} primaryColor={true} />
        </div>
      </div>
    );
  }
  if (!loadingProject && !loadingUserProject && project) {
    return (
      <div className="flex w-full justify-center p-2">
        <div className="dark:bg-black-light bg-white-dark relative flex h-full min-h-[40rem] w-full max-w-sm flex-col rounded-lg p-2 pt-0 sm:max-w-md sm:pt-4 md:max-w-2xl md:p-4 lg:max-w-3xl">
          <ProjectHeader
            projectId={project.id}
            isProjectStarted={isProjectStarted}
          />
          <ProjectTabLayout />
          <ProjectContent />
        </div>
      </div>
    );
  }
};

const ProjectBookmark = () => {
  const project = useRecoilValue(projectDetailsAtom);
  const setShowAccountDialog = useSetRecoilState(createAccountDialogAtom);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userBookmarks, setUserBookmarks] = useRecoilState(
    BookmarkedProjectsAtom,
  );
  const { fetchData: fetchUserBookmarks } = useFetchData();
  const { fetchData: fetchRemoveBookmark, loading: loadingRemoveBookmark } =
    useFetchData();
  const { fetchData: fetchAddBookmark, loading: loadingAddBookmark } =
    useFetchData();

  useEffect(() => {
    const isBookmarked = userBookmarks.some(
      (bookmark) => bookmark?.project?.id === project.id,
    );
    setIsBookmarked(isBookmarked);
  }, [userBookmarks]);

  useEffect(() => {
    async function getUserBookmarks() {
      if (userBookmarks.length) return;
      const token = localStorage.getItem('token');
      const options = {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetchUserBookmarks('/bookmark/', options);
      if (response.success) {
        setUserBookmarks(response.data.bookmarkedProjects);
      }
    }
    getUserBookmarks();
  }, []);
  async function removeBookmark() {
    const bookmark = userBookmarks.find(
      (bookmark) => bookmark.project.id === project.id,
    );
    const token = localStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookmarkId: bookmark.id }),
    };

    const { success } = await fetchRemoveBookmark('/bookmark/', options);
    if (success) {
      setUserBookmarks((prev) =>
        prev.filter((prevBookmark) => prevBookmark.id !== bookmark.id),
      );
    }
  }
  async function addBookmark() {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAccountDialog(true);
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId: project.id }),
    };

    const { success, data } = await fetchAddBookmark('/bookmark/', options);
    if (success) {
      console.log(data.bookmark);

      setUserBookmarks((prev) => [...prev, data.bookmark]);
    }
  }

  return (
    <>
      {isBookmarked ? (
        <button
          onClick={removeBookmark}
          style={{ animationDuration: '350ms' }}
          className={`rounded-md p-2 hover:bg-transparent/10 ${!!loadingRemoveBookmark && 'animate-pulse'}`}
        >
          <BookmarkIcon size="size-5" isBookmarked={true} />
        </button>
      ) : (
        <button
          onClick={addBookmark}
          style={{ animationDuration: '350ms' }}
          className={`rounded-md p-2 hover:bg-transparent/10 ${!!loadingAddBookmark && 'animate-pulse'}`}
        >
          <BookmarkIcon size="size-5" isBookmarked={false} />
        </button>
      )}
    </>
  );
};

const CancelProject = () => {
  const userProjects = useRecoilValue(userProjectsAtom);
  const project = useRecoilValue(projectDetailsAtom);
  const { fetchData, loading } = useFetchData();
  const setUserProjects = useSetRecoilState(userProjectsAtom);
  const showPopup = usePopupNotication();

  async function removeUserProject() {
    const currentProject = userProjects.find(
      (userProject) => userProject.project.id === project.id,
    );

    const options = {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProjectId: currentProject.id,
      }),

      method: 'DELETE',
    };

    const response = await fetchData('/user-projects/', options);
    if (response.success) {
      setUserProjects((prev) =>
        prev.filter((userProject) => userProject.project.id !== project.id),
      );
    } else {
      showPopup('error', response.error);
    }
  }

  return (
    <>
      <div className="mx-auto grid place-items-center">
        <button
          className="text-error bg-transparent/3 hover:bg-transparent/7 h-full w-max rounded-lg p-2 px-4 font-medium transition-colors"
          onClick={removeUserProject}
        >
          {loading ? 'Cancelling...' : 'Cancel Project'}
        </button>
      </div>
    </>
  );
};

const ProjectHeader = memo(({ projectId }) => {
  const navigate = useNavigate();
  const project = useRecoilValue(projectDetailsAtom);
  const setUserProject = useSetRecoilState(userProjectsAtom);
  const isProjectStarted = useRecoilValue(projectStartedSelector);

  const ProjectCTAButton = () => {
    const { fetchData, loading } = useFetchData();
    const showPopup = usePopupNotication();
    const setShowAccountDialog = useSetRecoilState(createAccountDialogAtom);

    async function handleStartProject() {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowAccountDialog(true);
        return;
      }
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
        showPopup('success', response.data.message);
        const project = response.data.userProject;
        setUserProject((prev) => [...prev, project]);
      } else {
        if (response.error === 'Request failed') {
          setShowAccountDialog(true);
        } else {
          showPopup('info', response.error);
        }
      }
    }

    async function handleProjectSubmission() {
      navigate(`/submit/${project.id}`);
    }

    return (
      <>
        <div className="min-w-32">
          {isProjectStarted ? (
            <div className="flex gap-2">
              <Button
                onClick={handleProjectSubmission}
                text={loading ? <Loader /> : 'Submit'}
              />
              <CancelProject />
            </div>
          ) : (
            <Button
              onClick={handleStartProject}
              text={loading ? <Loader /> : 'start project'}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="ml-2 flex flex-col gap-3">
        <div className="mt-3 flex items-start justify-between gap-3 sm:flex-row">
          <h1 className="font-heading inline flex-1 text-2xl font-medium tracking-wide">
            {project.name}
          </h1>
          <ProjectBookmark />
        </div>
        <div className="flex w-full flex-col justify-between gap-1 sm:flex-row">
          <div className="flex h-full items-center gap-3">
            <DifficultyTag difficulty={project.difficulty} />
            <DomainTag domain={project.domain} />
          </div>
          <div>
            <ToolsTag tools={project.tools} />
          </div>
        </div>
        <div className="mt-1 flex gap-4 sm:mt-2 md:flex-row">
          <ProjectCTAButton />
        </div>
      </div>
    </>
  );
});

const ProjectTabLayout = () => {
  const projectTabs = [
    { label: 'Get Started', value: 'get-started' },
    { label: 'Discussions', value: 'discussions' },
    { label: 'Submissions', value: 'submissions' },
  ];
  return (
    <TabsLayout tabs={projectTabs} activeTabAtom={projectDetailsActiveTab} />
  );
};

const ProjectContent = () => {
  const activeTab = useRecoilValue(projectDetailsActiveTab);
  const project = useRecoilValue(projectDetailsAtom);
  return (
    <section className="mt-3 flex h-full w-full flex-col rounded-md transition-all">
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
            styles={
              'sm:max-w-[20rem] !dark:bg-black-medium w-full max-w-full sm:mx-2 h-2xl pt-6'
            }
            project={project}
            href={`/project/${project.id}`}
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

export default ProjectDetails;
