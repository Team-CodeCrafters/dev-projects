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
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const { fetchData, loading } = useFetchData();
  const showPopup = usePopupNotication();

  useEffect(() => {
    if (!signupData.email) {
      setCurrentFormStep('signup-option');
      return;
    }

    const lastEmailRequest = localStorage.getItem('last-email-request');
    if (lastEmailRequest) {
      const timePassed = Date.now() - parseInt(lastEmailRequest);
      const cooldownTime = 2 * 60 * 1000;

      if (timePassed < cooldownTime) {
        const remaining = Math.ceil((cooldownTime - timePassed) / 1000);
        setTimeLeft(remaining);
        setCanResend(false);
      }
    }
  }, [signupData.email, setCurrentFormStep]);

  useEffect(() => {
    let interval;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);

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
      localStorage.removeItem('last-email-request');
      showPopup(
        'success',
        response?.data?.message || 'OTP verified successfully',
      );
      setCurrentFormStep('create-account');
    } else {
      console.log(response.status);
      showPopup('error', response.error);
    }
  }

  async function handleResendClick(e) {
    if (!canResend) return;

    try {
      localStorage.setItem('last-email-request', Date.now().toString());
      await handleEmailSubmit(e);
      setTimeLeft(120);
      setCanResend(false);

      showPopup('success', 'Verification code sent successfully!');
    } catch (error) {
      showPopup('error', `Failed to send verification code`);
      localStorage.removeItem('last-email-request');
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold">
        Verify your email
      </h2>
      <form onSubmit={handleVerifySubmit} className="space-y-6">
        <div className="text-center text-gray-300">
          Enter the verification code sent to <br />
          <span className="font-medium text-white">{signupData.email}</span>
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
          Content={isLoading || loading ? <Loader /> : 'Continue'}
          className="w-full"
        />
        <div className="text-center text-sm">
          Did not receive the email?{' '}
          {canResend ? (
            <button
              type="button"
              onClick={handleResendClick}
              className="text-blue-400 transition-colors hover:text-blue-300 hover:underline"
              disabled={!canResend}
            >
              Resend
            </button>
          ) : (
            <span className="text-gray-400">
              Resend in{' '}
              <span className="font-mono text-white">
                {formatTime(timeLeft)}
              </span>
            </span>
          )}
        </div>
        <div className="text-center text-sm">
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
