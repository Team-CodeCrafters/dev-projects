const SettingIcon = ({ size = 'size-6' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-more-vertical ${size}`}
    >
      <circle cx="12" cy="7" r="1"></circle>
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="17" r="1"></circle>
    </svg>
  );
};

export default SettingIcon;
