import { useState } from 'react';

const InputField = ({
  type,
  id = '',
  placeholder,
  value,
  onChange,
  pattern,
  isRequired = false,
  minLength,
  title,
  styles,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        required={isRequired}
        minLength={minLength}
        title={title ? title : undefined}
        className={`w-full rounded-lg border border-gray-600 px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1F1F1F] ${styles}`}
        pattern={pattern || undefined}
        min={isPassword ? 8 : undefined}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5S20.5 7.5 21.75 12
                16.5 19.5 12 19.5 3.5 16.5 2.25 12z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l18 18m-2.121-2.121A9.969 9.969 0 0112 19.5
                c-4.5 0-8.25-3-9.75-7.5a9.97 9.97 0 013.623-4.623M9.88 9.88
                A3 3 0 0114.12 14.12M10.607 6.263
                A9.969 9.969 0 0112 4.5c4.5 0 8.25 3 9.75 7.5
                a9.97 9.97 0 01-1.507 2.64"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default InputField;
