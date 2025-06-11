import { useState } from 'react';

const InputField = ({ type, placeholder, value, onChange, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-600 bg-[#1F1F1F] px-4 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        pattern={placeholder.toLowerCase() === "username" ? "^[A-Za-z0-9]*$" : undefined}
        title="Only letters and numbers are allowed. No spaces or special characters."
        {...rest}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
          tabIndex={-1}
        >
          {showPassword ? (
            // 👁️ Eye Open Icon (password is visible)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
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
            // 🙈 Eye Slash Icon (password is hidden)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
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
