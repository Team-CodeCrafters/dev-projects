import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../assets/icons/Filter';
import Cancel from '../assets/icons/Cancel';
import useFetchData from '../hooks/useFetchData';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { projectsAtom } from '../store/atoms/project';
import ProjectCard from '../components/projects/ProjectCard';
import usePopup from '../hooks/usePopup';
import SearchTagInput from '../components/projects/SearchTagInput';
import Loader from '../components/ui/Loader';
import { DIFFICULTIES, DOMAINS, TOOLS } from '../utils/constants';
import NoContentToDisplay from '../components/ui/NoContent';

const Projects = () => {
  const showPopup = usePopup();
  const setProjects = useSetRecoilState(projectsAtom);
  const { fetchData, loading } = useFetchData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: ['Beginner'],
    domain: ['Frontend'],
    tools: ['HTML', 'CSS', 'Javascript'],
  });

  const handleDifficultyChange = (level, checked) => {
    setSelectedFilters((prev) => ({
      ...prev,
      difficulty: checked
        ? [...prev.difficulty, level]
        : prev.difficulty.filter((item) => item !== level),
    }));
  };

  const applyFilers = useCallback(async () => {
    let toolsQuery = '';
    let difficultyQuery = '';
    let domainQuery = '';
    if (selectedFilters.tools.length > 0) {
      toolsQuery = `&tools=${selectedFilters.tools.join(',')}`;
    }
    if (selectedFilters.difficulty.length > 0) {
      difficultyQuery = `&difficulty=${selectedFilters.difficulty.join(',')}`;
    }
    if (selectedFilters.domain.length > 0) {
      domainQuery = `&domains=${selectedFilters.domain.join(',')}`;
    }

    const response = await fetchData(
      `/project/all?${difficultyQuery}${toolsQuery}${domainQuery}`
    );
    if (response.success) {
      setProjects(response.data.projects);
    } else {
      showPopup('error', response.error);
    }
  });

  return (
    <div className="relative min-h-screen w-full">
      <div className="ml-2 h-full rounded-lg p-3 md:p-5">
        <h1 className="font-heading mb-2 text-xl font-medium tracking-wide md:text-2xl">
          Projects
        </h1>
        <hr className="border-accent mt-3 border-t-2" />
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="bg-primary text-white-light hover:bg-secondary ml-5 mt-5 flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition md:ml-7"
      >
        <Filter /> Filter
      </button>

      {loading ? (
        <>
          <div className="relative top-52 grid place-items-center">
            <Loader primaryColor="bg-primary" />
          </div>
        </>
      ) : (
        <ProjectLists getInitialProjects={applyFilers} />
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-10 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`bg-black-light fixed right-0 top-0 z-50 h-full w-[60%] transform shadow-xl transition-transform duration-300 md:w-80 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="border-white-dark dark:border-black-lighter flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-primary-text dark:text-white-light text-lg font-bold">Filters</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                applyFilers();
              }}
              className="bg-primary text-white-light hover:bg-secondary rounded px-3 py-1 text-sm"
            >
              Apply
            </button>
            <button
              className="text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Cancel />
            </button>
          </div>
        </div>

        <div className="text-white-light h-[calc(100%-64px)] space-y-10 overflow-y-auto bg-[#1A1A1A] p-4 md:space-y-10 md:p-6">
          <div>
            <span className="text-white-light border-white-dark text-md block border-b pb-3 font-bold">
              Difficulty
            </span>
            <div className="mt-4 space-y-4 md:space-y-5">
              {DIFFICULTIES.map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 text-sm hover:text-white md:gap-4"
                >
                  <input
                    type="checkbox"
                    className="accent-primary h-4 w-4"
                    checked={selectedFilters.difficulty.includes(level)}
                    onChange={(e) =>
                      handleDifficultyChange(level, e.target.checked)
                    }
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <SearchTagInput
            title="Domain"
            options={DOMAINS}
            selected={selectedFilters.domain}
            setSelected={(domain) =>
              setSelectedFilters((prev) => ({ ...prev, domain }))
            }
          />

          <SearchTagInput
            title="Languages"
            options={TOOLS}
            selected={selectedFilters.tools}
            setSelected={(tools) =>
              setSelectedFilters((prev) => ({ ...prev, tools }))
            }
          />
        </div>
      </div>
    </div>
  );
};

const ProjectLists = ({ getInitialProjects }) => {
  const navigate = useNavigate();
  const projects = useRecoilValue(projectsAtom);

  useEffect(() => {
    if (projects === null) {
      getInitialProjects();
    }
  }, []);
  if (projects?.length <= 0) {
    return (
      <NoContentToDisplay
        heading={'No Content To Display'}
        body={'Consider changing filters to see more projects'}
      />
    );
  }

  return (
    <>
      <div className="mb-5 ml-1 flex flex-wrap items-stretch md:ml-3">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            styles={'sm:max-w-[20rem] h-full  mx-2  pt-6'}
            project={project}
            href={`/project/${project.id}`}
          />
        ))}
      </div>
    </>
  );
};

export default Projects;
