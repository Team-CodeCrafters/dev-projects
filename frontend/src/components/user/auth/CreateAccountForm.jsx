import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import useFetchData from '../../../hooks/useFetchData';
import Button from '../../ui/Button';
import InputField from '../../ui/InputField';
import Loader from '../../ui/Loader';
import usePopupNotication from '../../../hooks/usePopup';
import {
  signUpDataAtom,
  signupFormStepAtom,
} from '../../../store/atoms/userAtoms';

const CreateAccountForm = () => {
  const [signupData, setSignupData] = useRecoilState(signUpDataAtom);
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const { fetchData, loading } = useFetchData();
  const showPopup = usePopupNotication();

  useEffect(() => {
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
          maxLength={20}
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

export default CreateAccountForm;
