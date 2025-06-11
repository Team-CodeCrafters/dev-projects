import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import InputField from '../components/InputField';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

import logo from '../assets/images/dev-projects-dark.png';


const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/reset-password/${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        },
      );

      const data = await response.json();
      console.log('Reset Password Response:', data);

      if (response.ok) {
        setSuccessMsg('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Password reset failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Card>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="mb-4 text-center text-3xl font-semibold">
          Reset your password
        </h2>

        {successMsg && (
          <p className="text-center text-green-500">{successMsg}</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <InputField
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
    </div>
  );
};

export default ResetPassword;
