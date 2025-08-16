const Card = ({ children }) => {
  return (
    <div className="bg-black-neutral w-[90vw] rounded-2xl border border-[#2B2B2B] p-6 text-white shadow-lg sm:w-[32rem] sm:p-14">
      {children}
    </div>
  );
};

export default Card;
