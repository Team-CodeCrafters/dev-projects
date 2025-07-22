import { Link, useNavigate } from 'react-router-dom';
import InformationIcon from '../../assets/icons/Information';

const NoContentToDisplay = ({ Icon, heading, body, buttonText, href }) => {
  return (
    <div className="bg-white-medium dark:bg-black-medium m-4 rounded-lg p-3">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="dark:bg-black-light bg-white-dark mb-6 rounded-full p-6">
          {!!Icon ? <Icon /> : <InformationIcon />}
        </div>
        <h2 className="font-heading dark:text-white-light mb-3 text-xl font-medium tracking-wide">
          {heading ? heading : 'Nothing to see here'}
        </h2>
        {!!body && (
          <p className="dark:text-white-medium mb-8 max-w-md text-balance opacity-80">
            {body}
          </p>
        )}

        {!!href && (
          <Link
            to={href}
            className="bg-primary hover:bg-primary/90 duration-250 font-heading rounded-lg px-8 py-3 font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default NoContentToDisplay;
