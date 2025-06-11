export const ToggleSwitch = ({
  name = '',
  onChange,
  id = '',
  currentTheme,
}) => {
  const isChecked = currentTheme === 'dark';

  return (
    <label className="group relative inline-flex h-full w-full cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        id={id}
        name={name}
        checked={isChecked}
        onChange={onChange}
      />
      <div className="bg-black-light peer-checked:bg-black-dark peer h-6 w-12 rounded-full shadow-md outline-none ring-0 duration-300 after:absolute after:left-[2px] after:top-[2px] after:flex after:h-5 after:w-5 after:items-center after:justify-center after:rounded-full after:bg-gray-50 after:outline-none after:duration-300 after:content-[''] peer-checked:after:translate-x-6 peer-hover:after:scale-95 peer-focus:outline-none"></div>
    </label>
  );
};
