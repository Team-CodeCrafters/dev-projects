import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInDataAtom,
  signUpDataAtom,
  signupFormStepAtom,
} from '../store/atoms/userAtoms';
import useFetchData from '../hooks/useFetchData';
import Card from '../components/ui/Card';
import logo from '../assets/images/dev-projects-dark.png';
import usePopupNotication from '../hooks/usePopup';
import SignupSelectionForm from '../components/user/auth/SignupSelectionForm';
import EmailVerificationForm from '../components/user/auth/EmailVerificationForm';
import CreateAccountForm from '../components/user/auth/CreateAccountForm';
import UserAdditionalInfoForm from '../components/user/auth/UserAdditionalInfoForm';

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
      if (response.data?.isUserVerified) {
        showPopup('success', response.data.message);
        setCurrentFormStep('create-account');
      } else {
        localStorage.setItem('last-email-request', Date.now().toString());
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

export default Signup;
