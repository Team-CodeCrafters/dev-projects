const Button = ({ text, onClick, loading, styles }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-primary focus:ring-primary group relative flex h-12 w-full min-w-28 items-center justify-center overflow-hidden rounded-lg border-none px-3 text-base font-semibold capitalize text-white shadow-2xl outline-none transition-all hover:scale-[1.035] hover:bg-indigo-600 focus:scale-[1.035] focus:ring-2 focus:ring-offset-2 md:min-w-36 md:text-lg ${styles}`}
    >
      <span
        className={`transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'} `}
      >
        {text}
      </span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="absolute -left-[100%] top-0 h-full w-8 rotate-12 bg-white opacity-30 transition-all duration-[1s] ease-out group-hover:left-[120%] group-focus:left-[120%]" />
    </button>
  );
};

export default Button;
