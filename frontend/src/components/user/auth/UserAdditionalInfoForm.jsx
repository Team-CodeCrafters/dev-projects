import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import useFetchData from '../../../hooks/useFetchData';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import { signupFormStepAtom } from '../../../store/atoms/userAtoms';
import SearchTagInput from '../../../components/projects/SearchTagInput';
import { DOMAINS } from '../../../utils/constants';

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
          <Button
            type="submit"
            className="w-full"
            Content={loading ? <Loader /> : 'Complete Setup'}
          />
        </div>
        <div className="mt-4 text-center text-sm"></div>
      </form>
    </>
  );
};

export default UserAdditionalInfoForm;
