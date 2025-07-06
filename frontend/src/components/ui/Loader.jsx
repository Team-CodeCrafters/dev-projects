import { memo } from 'react';

const Loader = memo(({ primaryColor, height = 'h-7', width = 'w-7' }) => {
  return (
    <div
      className={`${height} ${width} animate-spin rounded-full border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent ${!!primaryColor && '!border-primary !dark:border-primary border-4 !border-t-transparent'} `}
    />
  );
});

export default Loader;
