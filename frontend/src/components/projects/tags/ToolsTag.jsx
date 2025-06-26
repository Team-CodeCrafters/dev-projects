import CodeIcon from '../../../assets/icons/Code';

const ToolsTag = ({ tools }) => {
  if (!tools || tools.length <= 0) return null;
  return (
    <div className="dark:bg-black-light dark:outline-white-dark flex w-full flex-col gap-2 rounded-lg bg-zinc-100 p-2 py-3 outline outline-1">
      <div className="mb-2 flex w-full items-center gap-2">
        <CodeIcon size={'size-5'} />
        <p className="text-center text-sm font-medium">
          Tools and Technologies
        </p>
      </div>
      <div className="flex gap-3">
        {tools.map((tool, index) => (
          <span
            key={index}
            className="dark:bg-white-light dark:text-black-dark rounded-md p-3 py-1 text-sm font-semibold tracking-tight outline outline-1"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
};
export default ToolsTag;
