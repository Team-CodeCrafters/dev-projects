const DifficultyTag = ({ difficulty }) => {
  if (!difficulty) return null;
  const diff = difficulty.toLowerCase();
  return (
    <span
      className={`flex items-center gap-1 p-2 text-xs capitalize opacity-95 ${diff === 'beginner' ? 'difficulty-beginner' : diff === 'intermediate' ? 'difficulty-intermediate' : diff === 'expert' ? 'difficulty-expert' : diff === 'master' ? 'difficulty-master' : ''}`}
    >
      {difficulty}
    </span>
  );
};

export default DifficultyTag;
