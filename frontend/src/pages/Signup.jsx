import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInDataAtom,
  signUpDataAtom,
  signupFormStepAtom,
} from '../store/atoms/userAtoms';
import useFetchData from '../hooks/useFetchData';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import logo from '../assets/images/dev-projects-dark.png';
import Loader from '../components/ui/Loader';
import usePopupNotication from '../hooks/usePopup';
import SearchTagInput from '../components/projects/SearchTagInput';
import { DOMAINS } from '../utils/constants';

const Signup = () => {
  const navigate = useNavigate();
  const [isFormChanging, setIsFormChanging] = useState(false);
  const [currentFormStep, setCurrentFormStep] =
    useRecoilState(signupFormStepAtom);
  const signupData = useRecoilValue(signUpDataAtom);
  const { fetchData, loading } = useFetchData();
  const showPopup = usePopupNotication();
  const setSigninData = useSetRecoilState(signInDataAtom);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    const response = await fetchData('/user/email-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: signupData.email }),
    });
    if (response.success) {
      if (response.data.isUserVerified) {
        showPopup('success', response.data.message);
        setCurrentFormStep('create-account');
      } else {
        setCurrentFormStep('email-verification');
      }
    } else {
      if (response.status === 409) {
        setSigninData({ identifier: signupData.email });
        localStorage.removeItem('current-form-step');
        navigate('/login');
        return;
      }
      showPopup('error', response.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      localStorage.removeItem('current-form-step');
      navigate('/dashboard');
    } else {
      const previousFormStep = localStorage.getItem('current-form-step');
      if (previousFormStep) {
        setCurrentFormStep(previousFormStep);
      }
    }
  }, []);

  useEffect(() => {
    setIsFormChanging(true);
    setTimeout(() => {
      setIsFormChanging(false);
    }, 250);
    localStorage.setItem('current-form-step', currentFormStep);
  }, [currentFormStep]);

  const getProgress = () => {
    if (currentFormStep === 'signup-option') {
      return 0;
    }
    if (currentFormStep === 'email-verification') {
      return 25;
    }
    if (currentFormStep === 'create-account') {
      return 50;
    }
    if (currentFormStep === 'additional-info') {
      return 75;
    }
    if (currentFormStep === 'completed') {
      return 100;
    }

    return 0;
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#141414]">
      <Card
        className="relative w-full max-w-md overflow-hidden p-8"
        styles={'bg-[#1f1f1f]'}
      >
        <div className="mb-6 h-0.5 bg-[#404040]">
          <div
            className="bg-secondary h-full transition-all duration-700 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <div
          className={`transition-all duration-500 ease-out ${
            isFormChanging
              ? 'translate-x-4 transform opacity-0'
              : 'translate-x-0 transform opacity-100'
          }`}
        >
          {currentFormStep === 'signup-option' && (
            <SignupSelectionForm
              handleEmailSubmit={handleEmailSubmit}
              isLoading={loading}
            />
          )}
          {currentFormStep === 'email-verification' && (
            <EmailVerificationForm
              handleEmailSubmit={handleEmailSubmit}
              isLoading={loading}
            />
          )}
          {currentFormStep === 'create-account' && <CreateAccountForm />}
          {currentFormStep === 'additional-info' && <UserAdditionalInfoForm />}
        </div>
      </Card>
    </div>
  );
};

const SignupSelectionForm = ({ handleEmailSubmit, isLoading }) => {
  const [signupData, setSignupData] = useRecoilState(signUpDataAtom);
  const navigate = useNavigate();

  function handleGuest() {
    localStorage.setItem('guest-account', true);
    navigate('/dashboard');
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
        <Button type="submit" Content={isLoading ? <Loader /> : 'Continue'} />
        <div className="mb-2 mt-7 flex w-full items-center gap-3 text-xs opacity-70">
          <span className="h-1 flex-1 border-t border-[#404040]"></span>
          <p>or</p>
          <span className="h-1 flex-1 border-t border-[#404040]"></span>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={handleGuest}
          Content={'Continue as Guest'}
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

const EmailVerificationForm = ({ handleEmailSubmit, isLoading }) => {
  const signupData = useRecoilValue(signUpDataAtom);
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const [otp, setOtp] = useState('');
  const { fetchData, loading } = useFetchData();
  const showPopup = usePopupNotication();

  useEffect(() => {
    if (!signupData.email) {
      setCurrentFormStep('signup-option');
    }
  }, []);

  async function handleVerifySubmit(e) {
    e.preventDefault();
    console.log({ otp, signupData });
    const response = await fetchData('/user/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: signupData.email, otp }),
    });

    if (response.success) {
      showPopup(
        'success',
        response?.data?.message || 'OTP verified successfully',
      );
      setCurrentFormStep('create-account');
    } else {
      showPopup('error', response.error);
    }
  }

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold">
        Verify your email
      </h2>
      <form onSubmit={handleVerifySubmit} className="space-y-6">
        <div className="text-center text-gray-300">
          Enter the verification code sent to <br />
          <span className="font-medium text-white">{signupData.email}</span>
          <div className="text-center">
            Did not receive the email?{' '}
            <button
              type="button"
              onClick={handleEmailSubmit}
              className="text-blue-400 hover:underline"
            >
              Resend
            </button>
          </div>
        </div>

        <InputField
          type="text"
          placeholder="Verification Code"
          value={otp}
          isRequired={true}
          maxLength={6}
          minLength={6}
          styles={'!bg-[#262626] text-center tracking-widest text-lg'}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button
          type="submit"
          Content={isLoading ? <Loader /> : 'Continue'}
          className="w-full"
        />
        <div className="mt-4 text-center text-sm">
          Use another email?{' '}
          <button
            type="button"
            onClick={() => setCurrentFormStep('signup-option')}
            className="text-blue-400 hover:underline"
          >
            Go back
          </button>
        </div>
      </form>
    </>
  );
};

const CreateAccountForm = () => {
  const [signupData, setSignupData] = useRecoilState(signUpDataAtom);
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const { fetchData, loading } = useFetchData();
  const showPopup = usePopupNotication();

  useEffect(() => {
    console.log({ signupData });
    if (!signupData.email) {
      showPopup('info', 'verification is required for your account');
      setCurrentFormStep('signup-option');
    }
  }, []);

  async function handleCreateAccount(e) {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      showPopup('error', "Passwords don't match");
      return;
    }

    const response = await fetchData('/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
      }),
    });

    if (response.success) {
      const token = response.data.token;
      localStorage.setItem('token', token);
      setCurrentFormStep('additional-info');
    } else {
      showPopup('error', response.error);
    }
  }

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold">
        Set up your account
      </h2>
      <form onSubmit={handleCreateAccount} className="space-y-6">
        <InputField
          type="text"
          placeholder="Username"
          value={signupData.username}
          isRequired={true}
          pattern="^[a-zA-Z0-9_]+$"
          title={'Username can only contain letters, numbers and underscore'}
          styles={'!bg-[#262626]'}
          onChange={(e) =>
            setSignupData({ ...signupData, username: e.target.value })
          }
        />
        <InputField
          type="password"
          placeholder="Password"
          minLength={8}
          isRequired={true}
          value={signupData.password}
          styles={'!bg-[#262626]'}
          onChange={(e) =>
            setSignupData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        />
        <InputField
          type="password"
          placeholder="Confirm Password"
          minLength={8}
          isRequired={true}
          styles={'!bg-[#262626]'}
          onChange={(e) => {
            setSignupData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }));
          }}
        />
        <Button
          type="submit"
          className="w-full"
          Content={loading ? <Loader /> : 'Continue'}
        />
        <div className="mt-4 text-center text-sm opacity-70">
          Use another email?{' '}
          <button
            type="button"
            onClick={() => setCurrentFormStep('signup-option')}
            className="text-blue-400 hover:underline"
          >
            Go back
          </button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

const UserAdditionalInfoForm = () => {
  const { fetchData, loading } = useFetchData();
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const [userDetails, setUserDetails] = useState({
    domains: [],
    experience: '',
  });
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('current-form-step');
      setCurrentFormStep('signup-option');
    }
  }, []);
  async function handleSignupSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('domain', userDetails.domains);
    formData.append('experience', userDetails.experience);

    const response = await fetchData('/user/update-profile', {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (response.success) {
      localStorage.removeItem('current-form-step');
      navigate('/dashboard');
    } else {
      showPopup('error', response.error);
    }
  }

  const handleExperienceChange = (level) => {
    setUserDetails((prev) => ({ ...prev, experience: level }));
    setIsSkillDropdownOpen(false);
  };

  const toggleSkillDropdown = () => {
    setIsSkillDropdownOpen(!isSkillDropdownOpen);
  };

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold">
        Tell us about yourself
      </h2>
      <form onSubmit={handleSignupSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="user-domain"
            className="font-heading mb-2 block text-sm text-gray-300"
          >
            Preferred domains
          </label>
          <SearchTagInput
            options={DOMAINS}
            placeholder={'Search domain'}
            selected={userDetails.domains}
            userDefined={true}
            dropDownPosition={`${window.innerWidth < 768 ? 'ABOVE' : 'BELOW'}`}
            setSelected={(domains) =>
              setUserDetails((prev) => ({ ...prev, domains }))
            }
          />
        </div>

        <div>
          <label
            htmlFor="skill-level"
            className="font-heading mb-2 block text-sm text-gray-300"
          >
            Experience Level
          </label>
          <div className="w-full rounded-md border border-gray-600 bg-[#262626]">
            <button
              type="button"
              onClick={toggleSkillDropdown}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-200">
                  {userDetails.experience
                    ? userDetails.experience
                    : 'Select your skill level'}
                </span>
              </div>
              <div
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isSkillDropdownOpen ? 'rotate-180' : ''
                }`}
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
              <div className="flex flex-col gap-2 border-t border-gray-600 px-3 pb-3">
                {[
                  { value: 'Beginner', description: '(0 to 1 year)' },
                  { value: 'Intermediate', description: '(1 to 3 years)' },
                  { value: 'Advanced', description: '(3+ years)' },
                ].map((level) => (
                  <label
                    key={level.value}
                    htmlFor={level.value.toLowerCase()}
                    className="relative flex h-10 cursor-pointer select-none items-center gap-2 rounded-lg px-2 text-sm transition-colors hover:bg-[#2a2a2a] has-[:checked]:bg-[#2a2a2a] has-[:checked]:text-blue-400"
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
                    <span className="text-gray-200">
                      {level.value}{' '}
                      <span className="ml-1 text-xs opacity-50">
                        {level.description}
                      </span>
                    </span>
                    <input
                      type="radio"
                      name="experience"
                      value={level.value}
                      className="absolute right-2 h-3 w-3 accent-blue-400"
                      id={level.value.toLowerCase()}
                      checked={userDetails.experience === level.value}
                      onChange={(e) => handleExperienceChange(e.target.value)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full" Content={'Complete Setup'} />
        </div>
        <div className="mt-4 text-center text-sm"></div>
      </form>
    </>
  );
};

export default Signup;
