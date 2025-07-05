import InformationIcon from '../../assets/icons/Information';

const NoContentToDisplay = () => {
  return (
    <div className="bg-white-dark dark:bg-black-light text-black-lighter m-2 grid h-32 w-full place-items-center p-3 text-center font-semibold tracking-wider outline-dotted outline-4 dark:text-white">
      <InformationIcon size="size-8" />
      Nothing to see here
    </div>
  );
};

export default NoContentToDisplay;
