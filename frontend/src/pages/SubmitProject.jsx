import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import useFetchData from '../hooks/useFetchData';
import { useRecoilValue } from 'recoil';
import { userProjectsAtom } from '../store/atoms/userProjects';
import Button from '../components/ui/Button';
import usePopupNotication from '../hooks/usePopup';
import Loader from '../components/ui/Loader';
import SearchTagInput from '../components/projects/SearchTagInput';
import { TOOLS } from '../utils/constants';
const SubmitProject = () => {
  const { id } = useParams();
  const showPop = usePopupNotication();
  const userProjects = useRecoilValue(userProjectsAtom);
  const [currentProject, setCurrentProject] = useState(null);
  const [submission, setSubmission] = useState({
    title: '',
    description: '',
    tools: [],
    githubRepo: '',
    liveUrl: '',
  });
  const { fetchData } = useFetchData();
  const { fetchData: fetchSubmit, loading, error } = useFetchData();
  async function getProjectDetails() {
    const response = await fetchData(`/project/${id}`);
    if (response.success) {
      setCurrentProject(response.data.project);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ ...submission, projectId: currentProject.id }),
    };
    const response = await fetchSubmit('/submissions', options);

    if (response.success) {
      showPop('success', response.data.message);
    } else {
      showPop('error', response.error);
    }
  }
  useEffect(() => {
    const currentProjectFound = userProjects.find(
      ({ projectId }) => projectId === id,
    );
    if (currentProjectFound) {
      setCurrentProject(currentProjectFound.project);
    } else {
      getProjectDetails();
    }
  }, [id]);

  if (currentProject) {
    return (
      <>
        <div className="bg-white-medium dark:bg-black-neutral flex h-full justify-center rounded-lg py-6 md:ml-3 md:p-5 md:pt-10">
          <div className="dark:outline-black-lighter bg-white-medium dark:bg-black-light h-max w-[95vw] max-w-lg rounded-xl px-4 py-8 outline outline-gray-200">
            <h1 className="font-heading mb-7 text-2xl font-medium tracking-wide">
              Submit Project
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="submission-title"
                  className="text-sm font-medium"
                >
                  Title
                </label>
                <InputField
                  onChange={(e) =>
                    setSubmission((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  id="submission-title"
                  type="text"
                  placeholder={currentProject.name}
                  styles={'!py-2 text-sm focus:ring-1 rounded-md'}
                  isRequired={true}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  onChange={(e) =>
                    setSubmission((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  id="description"
                  className="rounded-md border border-gray-600 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1F1F1F]"
                ></textarea>
              </div>
              <div className="flex gap-3">
                <div className="basis-full">
                  <label
                    htmlFor="github-url"
                    className="ml-1 text-xs font-medium"
                  >
                    GitHub URL
                  </label>
                  <InputField
                    onChange={(e) =>
                      setSubmission((prev) => ({
                        ...prev,
                        githubRepo: e.target.value,
                      }))
                    }
                    id="github-url"
                    type="text"
                    isRequired={true}
                    placeholder={'github.com/username/repo'}
                    styles={'!py-2 text-xs focus:ring-1'}
                  />
                </div>
                <div className="basis-full">
                  <label
                    htmlFor="live-url"
                    className="ml-1 text-xs font-medium"
                  >
                    Live URL
                  </label>
                  <InputField
                    onChange={(e) =>
                      setSubmission((prev) => ({
                        ...prev,
                        liveUrl: e.target.value,
                      }))
                    }
                    id="live-url"
                    type="text"
                    styles={'!py-2 text-xs focus:ring-1'}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="tools"
                  className="inline-block max-w-fit text-sm font-medium"
                >
                  Tools Used
                </label>
                <SearchTagInput
                  id={'tools'}
                  options={TOOLS}
                  selected={submission.tools}
                  userDefined={true}
                  setSelected={(tools) =>
                    setSubmission((prev) => ({ ...prev, tools }))
                  }
                />
              </div>
              <Button text={loading ? <Loader /> : 'submit'} />
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default SubmitProject;
