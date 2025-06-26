import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="bg-black-neutral w-[90vw] rounded-2xl border border-[#2B2B2B] p-14 text-white shadow-lg md:w-[32rem]">
      {children}
    </div>
  );
};

export default Card;
