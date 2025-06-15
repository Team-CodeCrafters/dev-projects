import { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import logo from '../assets/images/dev-projects-dark.png';
import useFetchData from '../hooks/useFetchData';
import { PopupNotification } from '../components/PopupNotification';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { fetchData, loading } = useFetchData();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    };

    const response = await fetchData('/user/forgot-password', options);

    if (response.success) {
      setSuccessMessage('Password reset instructions sent to your email.');
    } else {
      setErrorMessage(response.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <h2 className="mb-4 text-center text-3xl font-semibold">
          Forgot your password?
        </h2>
        <p className="mb-6 text-balance text-center text-gray-400">
          Enter your registered email and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <InputField
            type="email"
            placeholder="Email address"
            isRequired={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button text={loading ? <Loader /> : 'Send Reset Link'} />
        </form>

        <p className="mt-5 text-center text-gray-400">
          Back to{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
      {successMessage && (
        <PopupNotification text={successMessage} type="success" />
      )}
      {errorMessage && <PopupNotification text={errorMessage} type="error" />}
    </div>
  );
};

export default ForgotPassword;
