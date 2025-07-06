import { memo } from 'react';

const Loader = memo(({ primaryColor, height = 'h-7', width = 'w-7' }) => {
  return (
    <div
      className={`${height} ${width} animate-spin rounded-full border-2 border-white border-t-transparent ${!!primaryColor && 'border-primary border-4'} `}
    />
  );
});

export default Loader;
