import { formatString } from '../../../utils/formatters';

const ToolsTag = ({ tools }) => {
  if (!tools || tools.length <= 0) return null;
  return (
    <div className="flex w-full flex-col gap-2 border-[#495057] py-1">
      <div className="flex flex-wrap gap-3">
        {tools.map((tool, index) => (
          <span
            key={index}
            className="dark:bg-black-light dark:hover:bg-primary/20 dark:hover:text-primary hover:text-primary border-black-light group relative inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-600"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60 transition-opacity group-hover:opacity-100" />
            {formatString(tool)}
          </span>
        ))}
      </div>
    </div>
  );
};
export default ToolsTag;
