import React from 'react';

const Button = ({ text, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-lg border-none bg-blue-600 px-4 text-lg font-semibold capitalize text-white shadow-2xl transition-all hover:scale-105 hover:bg-indigo-600 focus:scale-105 focus:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
    >
      <div className="absolute -left-[100%] top-0 h-full w-8 rotate-12 bg-white opacity-30 transition-all duration-[1s] ease-out group-hover:left-[120%] group-focus:left-[120%]" />
      <span className="relative z-10">{text}</span>
    </button>
  );
};

export default Button;
