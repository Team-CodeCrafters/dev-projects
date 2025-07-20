import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../assets/icons/Filter';
import Cancel from '../assets/icons/Cancel';
import useFetchData from '../hooks/useFetchData';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { projectsAtom } from '../store/atoms/project';
import ProjectCard from '../components/projects/ProjectCard';
import usePopup from '../hooks/usePopup';
import SearchTagInput from '../components/projects/SearchTagInput';
import Loader from '../components/ui/Loader';
import InformationIcon from '../assets/icons/Information';

const Projects = () => {
  const showPopup = usePopup();
  const setProjects = useSetRecoilState(projectsAtom);
  const { fetchData, loading } = useFetchData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: ['Beginner'],
    domain: ['Frontend'],
    language: ['HTML', 'CSS', 'Javascript'],
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
    if (selectedFilters.language.length > 0) {
      toolsQuery = `&tools=${selectedFilters.language.join(',')}`;
    }
    if (selectedFilters.difficulty.length > 0) {
      difficultyQuery = `&difficulty=${selectedFilters.difficulty.join(',')}`;
    }
    if (selectedFilters.domain.length > 0) {
      domainQuery = `&domains=${selectedFilters.domain.join(',')}`;
    }

    const response = await fetchData(
      `/project/all?${difficultyQuery}${toolsQuery}${domainQuery}`,
    );
    console.log(selectedFilters);
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
        <div className="border-white-dark flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-white-light text-lg font-bold">Filters</h2>
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
            <button onClick={() => setIsSidebarOpen(false)}>
              <Cancel />
            </button>
          </div>
        </div>

        <div className="text-white-light h-[calc(100%-64px)] space-y-10 overflow-y-auto bg-[#1A1A1A] p-4 md:space-y-7 md:p-6">
          <div>
            <span className="text-white-light border-white-dark text-md block border-b pb-3 font-bold">
              Difficulty
            </span>
            <div className="mt-4 space-y-4 md:space-y-5">
              {['Beginner', 'Intermediate', 'Expert', 'Master'].map((level) => (
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
            options={[
              'Frontend',
              'Backend',
              'Web_Development',
              'App_Development',
              'AIML',
              'UIUX',
              'Full_Stack',
              'Blockchain',
              'Data_Science',
              'Cloud_Computing',
              'DevOps',
            ]}
            accent="accent-primary"
            selected={selectedFilters.domain}
            setSelected={(domain) =>
              setSelectedFilters((prev) => ({ ...prev, domain }))
            }
          />

          <SearchTagInput
            title="Languages"
            options={[
              'C',
              'Python',
              'Java',
              'React',
              'Node',
              'HTML',
              'CSS',
              'Javascript',
              'MongoDB',
              'PostgreSQL',
              'API',
              'Git',
              'React_Native',
              'Angular',
              'Vue',
              'Express',
              'Django',
              'Flask',
              'TensorFlow',
              'Scikit_Learn',
              'Pandas',
              'NumPy',
              'Kotlin',
              'Swift',
              'Firebase',
              'MySQL',
              'Docker',
              'AWS',
              'TypeScript',
              'GraphQL',
            ]}
            accent="accent-accent"
            selected={selectedFilters.language}
            setSelected={(language) =>
              setSelectedFilters((prev) => ({ ...prev, language }))
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
  function redirectToDetails(projectId) {
    navigate(`/project/${projectId}`);
  }
  useEffect(() => {
    if (projects === null) {
      console.log('getting inital projects');

      getInitialProjects();
    }
  }, []);
  if (projects?.length <= 0) {
    return <NoProjectsFound />;
  }
  return (
    <>
      <div className="ml-1 flex flex-wrap md:ml-3 md:w-full">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            styles={'sm:max-w-[20rem]   mx-2  pt-6'}
            project={project}
            onClick={() => redirectToDetails(project.id)}
          />
        ))}
      </div>
    </>
  );
};

const NoProjectsFound = () => {
  return (
    <div className="bg-white-medium dark:bg-black-medium m-4 rounded-lg p-3">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="dark:bg-black-light bg-white-dark mb-6 rounded-full p-6">
          <InformationIcon />
        </div>
        <h2 className="font-heading dark:text-white-light mb-3 text-xl font-medium tracking-wide">
          No Projects Found
        </h2>
        <p className="dark:text-white-medium mb-8 max-w-md text-balance opacity-80">
          Consider changing filters to see more projects
        </p>
      </div>
    </div>
  );
};

export default Projects;
