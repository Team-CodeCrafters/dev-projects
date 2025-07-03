import React from 'react';

const Button = ({ text, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className="bg-primary focus:ring-primary group relative flex w-full items-center justify-center overflow-hidden rounded-lg border-none p-3 px-4 text-lg font-semibold capitalize text-white shadow-2xl outline-none transition-all hover:scale-105 hover:bg-indigo-600 focus:scale-105 focus:ring-2 focus:ring-offset-2"
    >
      {text}
      <div className="absolute -left-[100%] top-0 h-full w-8 rotate-12 bg-white opacity-30 transition-all duration-[1s] ease-out group-hover:left-[120%] group-focus:left-[120%]" />
    </button>
  );
};

export default Button;
