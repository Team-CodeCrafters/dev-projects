const SkeletalLoader = ({
  height = 'h-7',
  width = 'w-full',
  styles = '',
  children,
}) => {
  return children ? (
    <div className={`flex w-full flex-col ${width} ${styles}`}>{children}</div>
  ) : (
    <div
      className={`my-1 flex w-full flex-col justify-start rounded-lg p-1 ${height} ${width} ${styles}`}
    >
      <div
        className={`dark:bg-black-light animate-pulse rounded-lg bg-gray-200 ${height} ${width}`}
      ></div>
    </div>
  );
};

export default SkeletalLoader;
