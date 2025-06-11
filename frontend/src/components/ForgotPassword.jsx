import { useState } from 'react';
import { Link } from 'react-router-dom';

import InputField from '../components/InputField';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

import logo from '../assets/images/dev-projects-dark.png';
import useFetchData from '../hooks/useFetchData';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [localError, setLocalError] = useState(null);

  const { fetchData, loading, error: fetchError } = useFetchData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLocalError(null);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    };

    const response = await fetchData('/user/forgot-password', options);

    if (response && response.success) {
      setMessage('Password reset instructions sent to your email.');
      setEmail('');
    } else if (response && response.message) {
      setLocalError(response.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="mb-4 text-center text-3xl font-semibold">
          Forgot your password?
        </h2>
        <p className="mb-6 text-center text-gray-400">
          Enter your registered email and we'll send you a link to reset your
          password.
        </p>

        {/* Reserve space for feedback messages */}
        <div className="min-h-[24px] text-center text-sm">
          {message && <span className="text-green-500">{message}</span>}
          {(localError || fetchError) && (
            <span className="text-red-500">{localError || fetchError}</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <InputField
            type="email"
            placeholder="Email address"
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
    </div>
  );
};

export default ForgotPassword;
