const Loader = ({ primaryColor, height = 'h-7', width = 'w-7' }) => {
  return (
    <div
      className={`${height} ${width} animate-spin rounded-full border-2 border-t-transparent dark:border-white ${!!primaryColor && 'border-primary border-4'} `}
    />
  );
};

export default Loader;
