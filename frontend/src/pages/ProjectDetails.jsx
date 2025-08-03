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

const ProjectSettings = () => {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const settingsBtnRef = useRef(null);

  return (
    <div className={`relative opacity-70 ${!!isSettingOpen && '!opacity-100'}`}>
      <button
        onClick={() => setIsSettingOpen((prev) => !prev)}
        ref={settingsBtnRef}
        className="focus:ring-primary absolutecursor-pointer group rounded-md p-1 outline-none focus:ring-2"
      >
        <SettingIcon size="sm:size-7 size-5" />
      </button>
      <SettingsDropDown
        settingsBtnRef={settingsBtnRef}
        setIsSettingOpen={setIsSettingOpen}
        isSettingOpen={isSettingOpen}
      />
    </div>
  );
};

const BookmarkButton = () => {
  const project = useRecoilValue(projectDetailsAtom);
  const { fetchData } = useFetchData();
  const addBookmark = useSetRecoilState(BookmarkedProjectsAtom);
  const showPopup = usePopupNotication();
  const setShowAccountDialog = useSetRecoilState(createAccountDialogAtom);

  async function handleBookmark(e) {
    e.stopPropagation();
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

    const response = await fetchData('/bookmark/', options);
    if (response.success) {
      showPopup('success', response.data.message);
      const newBookmark = response.data.bookmark;
      addBookmark((prev) => ({ ...prev, newBookmark }));
    } else {
      if (response.error == 'Request failed') {
        setShowAccountDialog(true);
      } else {
        showPopup('info', response.error);
      }
    }
  }

  return (
    <>
      <button
        onClick={handleBookmark}
        className="font-body duration box-content flex h-full w-full items-center justify-start gap-3 rounded-md transition-all duration-200 focus:scale-95"
      >
        <BookmarkIcon size={'size-4'} />
        <span>Save</span>
      </button>
    </>
  );
};

const CancelProject = () => {
  const userProjects = useRecoilValue(userProjectsAtom);
  const project = useRecoilValue(projectDetailsAtom);
  const { fetchData } = useFetchData();
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
      showPopup('info', response.data.message);
    } else {
      showPopup('error', response.error);
    }
  }

  return <button onClick={removeUserProject}>Cancel Project</button>;
};

const SettingsDropDown = ({
  settingsBtnRef,
  setIsSettingOpen,
  isSettingOpen,
}) => {
  const dropDownRef = useRef(null);
  const isProjectStarted = useRecoilValue(projectStartedSelector);
  useEffect(() => {
    function checkClick(e) {
      if (!isSettingOpen) return;
      const clickedInsideDropdown =
        settingsBtnRef?.current?.contains(e.target) ||
        dropDownRef.current?.contains(e.target);

      if (!clickedInsideDropdown) {
        setIsSettingOpen(false);
      }
    }
    function checkKeyPress(e) {
      if (!isSettingOpen) return;

      if (e.key === 'Escape') setIsSettingOpen(false);
    }
    document.body.addEventListener('click', checkClick);
    document.body.addEventListener('keyup', checkKeyPress);
    return () => {
      document.body.removeEventListener('click', checkClick);
      document.body.removeEventListener('keyup', checkKeyPress);
    };
  }, [isSettingOpen]);

  return (
    <div
      ref={dropDownRef}
      className={`dark:bg-black-medium duration-250 absolute right-0 top-[100%] z-50 grid h-max w-max items-center rounded-md bg-white shadow-md transition-all ${isSettingOpen ? `visible translate-y-2 opacity-100` : `invisible translate-y-[-10%] opacity-0`}`}
    >
      <ul className="font-body flex min-w-max flex-col gap-1 p-2 py-3 text-left text-sm">
        <li className="hover:bg-white-medium dark:hover:bg-black-light cursor-pointer rounded-md px-3 py-2">
          <BookmarkButton />
        </li>
        {!!isProjectStarted && (
          <li className="hover:bg-white-medium text-error dark:hover:bg-black-light min-h-8 flex-1 cursor-pointer rounded-md px-3 py-2">
            <CancelProject />
          </li>
        )}
      </ul>
    </div>
  );
};

const ProjectHeader = memo(({ projectId }) => {
  const navigate = useNavigate();
  const project = useRecoilValue(projectDetailsAtom);
  const setUserProject = useSetRecoilState(userProjectsAtom);
  const isProjectStarted = useRecoilValue(projectStartedSelector);

  const StartProjectButton = () => {
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
      <div className="min-w-32">
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

  return (
    <>
      <div className="ml-2 flex flex-col gap-3">
        <div className="mt-3 flex items-start justify-between gap-3 sm:flex-row">
          <h1 className="font-heading inline flex-1 text-2xl font-medium tracking-wide">
            {project.name}
          </h1>
          <ProjectSettings />
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
          <StartProjectButton />
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
