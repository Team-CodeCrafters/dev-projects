const Card = ({ children, styles }) => {
  return (
    <div
      className={`bg-black-neutral w-[90vw] rounded-2xl border border-[#2B2B2B] p-6 text-white shadow-lg sm:w-[28rem] sm:p-10 ${styles}`}
    >
      {children}
    </div>
  );
};

export default Card;
