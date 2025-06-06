const LoadingPage = () => {
  return (
    <div className="grid h-screen w-screen items-center">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-indigo-500 text-4xl">
          <div className="text- flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-pink-500 text-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
