const SkeletalLoader = ({ height = 'h-16', width = 'w-full' }) => {
  return (
    <div
      className={`bg-white-dark dark:bg-black-neutral m-2 flex w-full flex-row items-center justify-center rounded-lg p-1 ${height} ${width}`}
    >
      <div className="flex w-full flex-col items-start justify-center gap-2">
        <div className="bg-black-light h-5 w-[20%] animate-pulse rounded-lg"></div>
        <div className="dark:bg-black-light h-4 w-3/5 animate-pulse rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
};

export default SkeletalLoader;
