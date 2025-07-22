import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from '../assets/icons/Filter';
import Cancel from '../assets/icons/Cancel';
import useFetchData from '../hooks/useFetchData';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectsAtom } from '../store/atoms/project';
import ProjectCard from '../components/projects/ProjectCard';
import usePopup from '../hooks/usePopup';
import SearchTagInput from '../components/projects/SearchTagInput';
import Loader from '../components/ui/Loader';

const Projects = () => {
  const showPopup = usePopup();
  const [projects, setProjects] = useRecoilState(projectsAtom);
  const { fetchData, loading } = useFetchData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: [],
    domain: [],
    language: [],
  });

  const handleDifficultyChange = (level, checked) => {
    setSelectedFilters((prev) => ({
      ...prev,
      difficulty: checked
        ? [...prev.difficulty, level]
        : prev.difficulty.filter((item) => item !== level),
    }));
  };

  const applyFilers = async () => {
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
      domainQuery = `&domain=${selectedFilters.domain.join(',')}`;
    }
    const response = await fetchData(
      `/project/all?${difficultyQuery}${toolsQuery}${domainQuery}`
    );
    if (response.success) {
      setProjects(response.data.projects);
    } else {
      showPopup('error', response.error);
    }
  };

  return (
    <div className="relative bg-white-medium dark:bg-black-medium min-h-screen">
      <div className="mt-10 ml-10">
        <h1 className="font-heading text-primary-text dark:text-white-light mb-3 text-4xl font-bold">
          Projects
        </h1>
        <hr className="border-primary mt-3 w-97 border-t-2" />
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="bg-primary text-white-light hover:bg-secondary mt-7 ml-10 flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition"
      >
        <Filter /> Filter
      </button>

      {loading ? (
        <div className="w-full h-full flex justify-center items-center relative top-52">
          <Loader primaryColor="bg-primary" />
        </div>
      ) : (
        <ProjectLists />
      )}

      {isSidebarOpen && (
        <div
          className="bg-opacity-10 fixed inset-0 z-40 bg-black backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`bg-white-dark dark:bg-black-light fixed top-0 right-0 z-50 h-full w-80 transform shadow-xl transition-transform duration-300 ${
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
            <button onClick={() => setIsSidebarOpen(false)}>
              <Cancel />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-64px)] space-y-10 overflow-y-auto bg-white-dark dark:bg-[#1A1A1A] px-6 py-6">
          <div>
            <h3 className="text-xl font-bold text-primary-text dark:text-white-light border-b border-white-dark dark:border-black-lighter pb-3">
              Difficulty
            </h3>
            <div className="mt-4 space-y-5">
              {['Beginner', 'Intermediate', 'Expert', 'Master'].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-4 text-base text-primary-text dark:text-white-light hover:text-black dark:hover:text-white"
                >
                  <input
                    type="checkbox"
                    className="accent-primary h-5 w-5"
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
              'Fullstack',
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

const ProjectLists = () => {
  const navigate = useNavigate();
  const projects = useRecoilValue(projectsAtom);

  function redirectToDetails(projectId) {
    navigate(`/project/${projectId}`);
  }

  if (projects?.length <= 0) {
    return (
      <div className="text-primary-text dark:text-white-light mt-10 text-center text-lg">
        No projects found.
      </div>
    );
  }

  return (
    <div className="mx-4 flex w-full flex-wrap">
      {projects?.map((project) => (
        <ProjectCard
          key={project.id}
          styles="sm:max-w-[20rem] w-full mx-2 pt-6"
          project={project}
          onClick={() => redirectToDetails(project.id)}
        />
      ))}
    </div>
  );
};

export default Projects;
