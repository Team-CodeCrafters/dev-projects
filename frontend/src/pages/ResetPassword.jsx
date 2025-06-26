import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import logo from '../assets/images/dev-projects-dark.png';
import useFetchData from '../hooks/useFetchData';
import { PopupNotification } from '../components/ui/PopupNotification';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [signInData, setSignInData] = useState({
    password: '',
    confirmPassword: '',
  });
  const { fetchData, loading } = useFetchData();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    setSuccessMessage(null);
    setErrorMessage(null);
    e.preventDefault();
    if (signInData.password !== signInData.confirmPassword) {
      setErrorMessage('passwords do not match');
      return;
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: signInData.password }),
    };

    const response = await fetchData(
      `/user/reset-password?token=${token}`,
      options,
    );
    if (response.success) {
      setSuccessMessage('password reset successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrorMessage(response.error);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Card>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="mb-4 text-center text-3xl font-semibold">
          Reset your password
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <InputField
            type="password"
            placeholder="New Password"
            value={signInData.password}
            isRequired={true}
            minLength={8}
            onChange={(e) =>
              setSignInData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <InputField
            type="password"
            placeholder="Confirm New Password"
            value={signInData.confirmPassword}
            isRequired={true}
            minLength={8}
            onChange={(e) =>
              setSignInData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          <Button text={loading ? <Loader size="20" /> : 'Reset Password'} />
        </form>
        <p className="mt-5 text-center text-gray-400">
          Back to{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Sign in
          </a>
        </p>
      </Card>
      {successMessage && (
        <PopupNotification text={successMessage} type="success" />
      )}
      {errorMessage && <PopupNotification text={errorMessage} type="error" />}
    </div>
  );
};

export default ResetPassword;
