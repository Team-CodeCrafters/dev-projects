import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-[#0F0F0F] text-white p-14 rounded-2xl shadow-lg w-[500px] md:w-[600px] border border-[#2B2B2B]">
      {children}
    </div>
  );
};

export default Card;
