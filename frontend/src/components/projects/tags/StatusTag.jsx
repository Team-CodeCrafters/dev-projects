import { CircleCheckIcon } from '../../../assets/icons/CircleCheck';

const StatusTag = ({ status }) => {
  if (!status) return null;
  const st = status.toLowerCase();

  return (
    <span
      className={`flex w-min items-center gap-1 text-center md:gap-2 ${st === 'started' ? 'status-started' : st === 'inprogress' ? 'status-inprogress' : st === 'completed' ? 'status-completed' : ''} `}
    >
      {st === 'started' && <CircleCheckIcon size="size-5" />}
      {status}
    </span>
  );
};

export default StatusTag;
