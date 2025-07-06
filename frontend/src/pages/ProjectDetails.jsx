import { useEffect, useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../hooks/useFetchData';
import { projectDetailsAtom, projectDetailsTab } from '../store/atoms/project';
import { useRecoilState, useRecoilValue } from 'recoil';
import DifficultyTag from '../components/projects/tags/DifficultyTag';
import DomainTag from '../components/projects/tags/DomainTag';
import ToolsTag from '../components/projects/tags/ToolsTag';
import { BookmarkIcon } from '../assets/icons/Bookmark';
import Button from '../components/ui/Button';
import NoContentToDisplay from '../components/ui/NoContent';
import Loader from '../components/ui/Loader';
import { PopupNotification } from '../components/ui/PopupNotification';
import CreateAccountDialog from '../components/ui/CreateAccountDialog';

const ProjectDetails = () => {
  const { id } = useParams();
  const { fetchData, loading, error } = useFetchData();
  const [project, setProject] = useRecoilState(projectDetailsAtom);

  useEffect(() => {
    async function getProjectDetails() {
      const response = await fetchData(`/project/${id}`);
      if (response.success) {
        setProject(response.data.project);
        document.title = `Dev Projects | ${response.data.project.name}`;
      }
    }
    getProjectDetails();
  }, []);

  if (error) {
    return <PopupNotification text={error} type="error" />;
  }
  if (loading) {
    return (
      <div className="dark:bg-black-light bg-white-dark bg-red relative grid h-full w-full place-items-center rounded-lg p-2 pt-4 md:m-2 md:max-w-xl md:p-4 lg:max-w-2xl">
        <Loader height={'h-8'} width={'w-8'} primaryColor={true} />
      </div>
    );
  }
  if (project) {
    return (
      <div className="dark:bg-black-light bg-white-dark bg-red relative flex w-full flex-col rounded-lg p-2 pt-4 md:m-2 md:max-w-xl md:p-4 lg:max-w-2xl">
        <ProjectHeader projectId={project.id} />
        <TabsLayout />
        <ProjectContent />
      </div>
    );
  }
};

const ProjectHeader = ({ projectId }) => {
  const project = useRecoilValue(projectDetailsAtom);

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

      await fetchData('/user-projects/create', options);
    }

    return (
      <div className="min-w-32">
        {!!error &&
          (error === 'Request failed' ? (
            <CreateAccountDialog />
          ) : (
            <PopupNotification type="error" text={error} />
          ))}
        <Button
          onClick={handleStartProject}
          text={loading ? <Loader /> : 'Start Project'}
          disabled={loading}
        />
      </div>
    );
  };

  const BookmarkButton = ({}) => {
    const { fetchData, data, loading, error } = useFetchData();

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

      await fetchData('/bookmark/', options);
    }

    return (
      <>
        {!!data && <PopupNotification type="success" text={data.message} />}
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
        <div>
          <ToolsTag tools={project.tools} />
        </div>
        <div className="mt-4 flex gap-4 md:flex-row">
          <StartProjectButton />
          <BookmarkButton />
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

  return (
    <section className="mt-3 rounded-md transition-all">
      {activeTab === 'get-started' && <ProjectInformation />}
      {activeTab === 'submissions' && <Submissions />}
      {activeTab === 'discussions' && <Discussions />}
    </section>
  );
};

const ProjectInformation = () => {
  const project = useRecoilValue(projectDetailsAtom);
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
    </div>
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
