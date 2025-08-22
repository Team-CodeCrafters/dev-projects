import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpDataAtom, signupFormStepAtom } from '../store/atoms/userAtoms';
import useFetchData from '../hooks/useFetchData';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import logo from '../assets/images/dev-projects-dark.png';
import usePopupNotication from '../hooks/usePopup';
import SearchTagInput from '../components/projects/SearchTagInput';
import { DOMAINS } from '../utils/constants';

const Signup = () => {
  const currentFormStep = useRecoilValue(signupFormStepAtom);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#141414]">
      <Card className="w-full max-w-md p-8" styles={'bg-[#1f1f1f]'}>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        {currentFormStep === 'signup-option' && <SignupSelection />}
        {currentFormStep === 'email-verification' && <EmailVerification />}
        {currentFormStep === 'onboarding' && <UserOnboarding />}
      </Card>
    </div>
  );
};

const SignupSelection = () => {
  const [signupData, setSignupData] = useRecoilState(signUpDataAtom);
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const navigate = useNavigate();
  function handleGuest() {
    localStorage.setItem('guest-account', true);
    navigate('/dashboard');
  }
  function handleEmailSubmit(e) {
    e.preventDefault();
    console.log('sending email');
    setCurrentFormStep('email-verification');
  }
  return (
    <>
      <h2 className="mb-4 mt-2 text-center text-3xl font-semibold">
        Create an account
      </h2>
      <form onSubmit={handleEmailSubmit} className="mt-3">
        <InputField
          type="email"
          placeholder="Email"
          value={signupData.email}
          isRequired={true}
          styles={'!bg-[#262626] my-4'}
          onChange={(e) =>
            setSignupData({ ...signupData, email: e.target.value })
          }
        />
        <Button type="submit" text={'Continue'} />
        <div className="mb-2 mt-7 flex w-full items-center gap-3 text-xs opacity-70">
          <span className="h-1 flex-1 border-t border-[#404040]"></span>
          <p>or</p>
          <span className="h-1 flex-1 border-t border-[#404040]"></span>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={handleGuest}
          text={'Continue as Guest'}
          styles={
            '!bg-black-light  outline outline-black-black !text-white !text-sm !font-medium'
          }
        />
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </>
  );
};

const EmailVerification = () => {
  const signupData = useRecoilValue(signUpDataAtom);
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const [otp, setOtp] = useState('');
  function handleVerifySubmit(e) {
    e.preventDefault();
    console.log('verifying otp', otp);

    if (otp.length !== 6) {
      console.log('Please enter a valid 6-digit code');
      return;
    }
    setCurrentFormStep('onboarding');
  }
  return (
    <>
      <form onSubmit={handleVerifySubmit} className="space-y-6">
        <div className="text-center text-gray-700 dark:text-gray-300">
          Enter the verification code sent to <b>{signupData.email}</b>
        </div>
        <InputField
          type="text"
          placeholder="Verification Code"
          value={otp}
          isRequired={true}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button type="submit" text={'Confirm'} className="w-full" />
        <div className="mt-4 text-center text-sm">
          Use another email?{' '}
          <button
            onClick={() => setCurrentFormStep('signup-option')}
            className="text-blue-400 hover:underline"
          >
            Use another email
          </button>
        </div>
      </form>
    </>
  );
};

const UserOnboarding = () => {
  const [signupData, setSignupData] = useRecoilState(signUpDataAtom);
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const [selectedFilters, setSelectedFilters] = useState({
    domains: [],
    skillLevel: '',
  });
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  function handleUsernameSubmit(e) {
    e.preventDefault();
    console.log('submitting username');
    setCurrentFormStep('onboarding');
  }

  const handleSkillLevelChange = (level) => {
    setSelectedFilters((prev) => ({ ...prev, skillLevel: level }));
    setIsSkillDropdownOpen(false);
  };

  const toggleSkillDropdown = () => {
    setIsSkillDropdownOpen(!isSkillDropdownOpen);
  };

  return (
    <>
      <form onSubmit={handleUsernameSubmit} className="space-y-6">
        <InputField
          type="text"
          placeholder="Username"
          value={signupData.username}
          isRequired={true}
          pattern="^[a-zA-Z0-9_]+$"
          title={'Username can only contain letters, numbers and underscore'}
          onChange={(e) =>
            setSignupData({ ...signupData, username: e.target.value })
          }
        />

        <div>
          <label htmlFor="user-domain" className="font-heading mt-4 text-sm">
            preferred domain
          </label>
          <SearchTagInput
            options={DOMAINS}
            selected={selectedFilters.domains}
            userDefined={true}
            dropDownPosition={`${window.innerWidth < 768 ? 'ABOVE' : 'BELOW'}`}
            setSelected={(domains) =>
              setSelectedFilters((prev) => ({ ...prev, domains }))
            }
          />
        </div>

        <div>
          <label
            htmlFor="skill-level"
            className="font-heading mb-3 mt-4 block text-sm"
          >
            projects building skill level
          </label>
          <div className="dark:bg-black-lighter w-full rounded-md border border-gray-600 bg-[#1F1F1F] dark:border-gray-600">
            <button
              type="button"
              onClick={toggleSkillDropdown}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors hover:bg-gray-700 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 text-gray-400 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-200 dark:text-gray-200">
                  {selectedFilters.skillLevel
                    ? selectedFilters.skillLevel.charAt(0).toUpperCase() +
                      selectedFilters.skillLevel.slice(1)
                    : 'Select your skill level'}
                </span>
              </div>
              <div
                className={`h-4 w-4 text-gray-400 transition-transform dark:text-gray-400 ${isSkillDropdownOpen ? 'rotate-180' : ''}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {isSkillDropdownOpen && (
              <div className="flex flex-col gap-2 border-t border-gray-600 px-3 pb-3 dark:border-gray-600">
                <label
                  htmlFor="beginner"
                  className="has-[:checked]:bg-black-light hover:bg-black-light relative flex h-10 cursor-pointer select-none items-center gap-2 rounded-lg px-2 text-sm has-[:checked]:text-blue-400 has-[:checked]:ring-1 has-[:checked]:ring-black"
                >
                  <div className="w-4 fill-current">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <span className="text-gray-200 dark:text-gray-200">
                    Beginner
                  </span>
                  <input
                    type="radio"
                    name="skillLevel"
                    value="beginner"
                    className="peer/beginner absolute right-2 h-3 w-3 accent-blue-400"
                    id="beginner"
                    checked={selectedFilters.skillLevel === 'beginner'}
                    onChange={(e) => handleSkillLevelChange(e.target.value)}
                  />
                </label>

                <label
                  htmlFor="intermediate"
                  className="has-[:checked]:bg-black-light hover:bg-black-light relative flex h-10 cursor-pointer select-none items-center gap-2 rounded-lg px-2 text-sm has-[:checked]:text-blue-400 has-[:checked]:ring-1 has-[:checked]:ring-black"
                >
                  <div className="w-4 fill-current">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2ZM12 6L10.5 10.5L6 12L10.5 13.5L12 18L13.5 13.5L18 12L13.5 10.5L12 6Z" />
                    </svg>
                  </div>
                  <span className="text-gray-200 dark:text-gray-200">
                    Intermediate
                  </span>
                  <input
                    type="radio"
                    name="skillLevel"
                    value="intermediate"
                    className="absolute right-2 h-3 w-3 accent-blue-400"
                    id="intermediate"
                    checked={selectedFilters.skillLevel === 'intermediate'}
                    onChange={(e) => handleSkillLevelChange(e.target.value)}
                  />
                </label>

                <label
                  htmlFor="advanced"
                  className="has-[:checked]:bg-black-light hover:bg-black-light relative flex h-10 cursor-pointer select-none items-center gap-2 rounded-lg px-2 text-sm has-[:checked]:text-blue-400 has-[:checked]:ring-1 has-[:checked]:ring-black"
                >
                  <div className="w-4 fill-current">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L16.09 8.26L22 9L16.09 9.74L12 16L7.91 9.74L2 9L7.91 8.26L12 2ZM12 4L9.5 9.5L4 12L9.5 14.5L12 20L14.5 14.5L20 12L14.5 9.5L12 4ZM12 8L11 10L8 11L11 12L12 16L13 12L16 11L13 10L12 8Z" />
                    </svg>
                  </div>
                  <span className="text-gray-200 dark:text-gray-200">
                    Advanced
                  </span>
                  <input
                    type="radio"
                    name="skillLevel"
                    value="advanced"
                    className="absolute right-2 h-3 w-3 accent-blue-400"
                    id="advanced"
                    checked={selectedFilters.skillLevel === 'advanced'}
                    onChange={(e) => handleSkillLevelChange(e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" text={'Signup'} />
      </form>
    </>
  );
};

export default Signup;
