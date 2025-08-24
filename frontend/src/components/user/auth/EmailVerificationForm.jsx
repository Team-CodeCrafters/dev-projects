import { useRecoilValue, useSetRecoilState } from 'recoil';
import useFetchData from '../../../hooks/useFetchData';
import Button from '../../ui/Button';
import InputField from '../../ui/InputField';
import {
  signUpDataAtom,
  signupFormStepAtom,
} from '../../../store/atoms/userAtoms';
import usePopupNotication from '../../../hooks/usePopup';
import { useState, useEffect } from 'react';
import Loader from '../../ui/Loader';

const EmailVerificationForm = ({ handleEmailSubmit, isLoading }) => {
  const signupData = useRecoilValue(signUpDataAtom);
  const setCurrentFormStep = useSetRecoilState(signupFormStepAtom);
  const [otp, setOtp] = useState('');
  const { fetchData } = useFetchData();
  const showPopup = usePopupNotication();

  useEffect(() => {
    if (!signupData.email) {
      setCurrentFormStep('signup-option');
    }
  }, []);

  async function handleVerifySubmit(e) {
    e.preventDefault();
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

export default EmailVerificationForm;
