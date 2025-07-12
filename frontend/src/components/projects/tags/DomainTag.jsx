import { formatString } from '../../../utils/formatters';

const DomainTag = ({ domain }) => {
  if (!domain) return null;
  return (
    <span className="text-domain grid w-max items-center text-center">
      {formatString(domain)}
    </span>
  );
};

export default DomainTag;
