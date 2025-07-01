import CodeIcon from '../../../assets/icons/Code';

const ToolsTag = ({ tools }) => {
  if (!tools || tools.length <= 0) return null;
  return (
    <div className="mt-3 flex w-full flex-col gap-2 border-t-[1px] border-[#495057] p-2">
      <div className="mb-2 flex w-full items-center gap-2">
        <CodeIcon size={'size-5'} />
        <p className="text-center text-sm font-medium">
          Tools and Technologies
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool, index) => (
          <span
            key={index}
            className="shadow-primary relative rounded-[999px] p-3 py-1 text-sm font-semibold tracking-tight opacity-85 shadow-sm outline outline-1 outline-gray-500 transition-all hover:shadow-lg"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
};
export default ToolsTag;
