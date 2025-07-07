import DifficultyTag from './tags/DifficultyTag';
import DomainTag from './tags/DomainTag';
import StatusTag from './tags/StatusTag';
import ToolsTag from './tags/ToolsTag';

const ProjectCard = ({ project, status, onClick, styles, children }) => {
  return (
    <div
      className={`bg-white-light dark:bg-black-light outline-white-dark dark:outline-black-dark hover:outline-primary dark:hover:outline-primary duration-250 group relative my-4 flex w-full max-w-2xl cursor-pointer rounded-md p-4 outline outline-2 transition-all duration-700 hover:shadow-md ${styles}`}
      onClick={onClick}
    >
      {children}
      <div className="w-full gap-1">
        <div className="mb-3 flex items-start justify-between sm:items-center md:mb-2 md:flex-row">
          <span className="font-heading w-max text-lg font-medium tracking-tight md:text-xl">
            {project.name}
          </span>
          {!!status && (
            <span>
              <StatusTag status={status} />
            </span>
          )}
        </div>
        <span className="text-md mb-5 line-clamp-2 w-[90%] opacity-75">
          {project.about}
        </span>
        <div className="flex items-center gap-2">
          <DifficultyTag difficulty={project.difficulty} />
          <DomainTag domain={project.domain} />
        </div>
        <div className="my-2 py-2">
          <ToolsTag tools={project.tools} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
