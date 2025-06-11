import React from 'react';

const Button = ({ text, ...props }) => {
  return (
    <button
      {...props}
      className="relative flex h-[52px] w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-lg font-semibold text-white hover:bg-blue-700"
    >
      {text}
    </button>
  );
};

export default Button;
