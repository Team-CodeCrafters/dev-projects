import InformationIcon from '../../assets/icons/Information';

const NoContentToDisplay = ({ text }) => {
  return (
    <div className="bg-white-dark dark:bg-black-light text-black-lighter m-2 grid h-32 w-full place-items-center p-3 text-center font-semibold tracking-wider outline outline-2 dark:text-white">
      <InformationIcon size="size-8" />
      {text ? text : 'Nothing to see here'}
    </div>
  );
};

export default NoContentToDisplay;
