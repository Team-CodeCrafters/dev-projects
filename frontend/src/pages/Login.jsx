import { useRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { signInDataAtom } from '../store/atoms/userAtoms';
import useFetchData from '../hooks/useFetchData';
import InputField from '../components/InputField';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import logo from '../assets/images/dev-projects-dark.png';
import { PopupNotification } from '../components/PopupNotification';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  });

  const [signInData, setSignInData] = useRecoilState(signInDataAtom);
  const { fetchData, error, loading } = useFetchData();
  async function handleSubmit(e) {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
    };

    const response = await fetchData('/user/signin', options);
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } else {
    }
  }

  return (
    <div className="px- bg-black flex min-h-screen items-center justify-center">
      <Card>
        {/* ✅ Logo added here */}
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="font-heading mb-4 mt-2 text-center text-3xl font-semibold">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <InputField
            type="text"
            placeholder="Username or Email"
            pattern="^[a-zA-Z0-9@.-_]+$"
            value={signInData.identifier}
            title={
              'Enter a valid username (letters, numbers, underscore) or an email address.'
            }
            isRequired={true}
            onChange={(e) =>
              setSignInData((prev) => ({
                ...prev,
                identifier: e.target.value,
              }))
            }
          />

          <InputField
            type="password"
            placeholder="Password"
            minLength={8}
            isRequired={true}
            value={signInData.password}
            onChange={(e) =>
              setSignInData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Button text={loading ? <Loader /> : 'Sign In'} />
        </form>

        <p className="mt-5 text-center text-gray-400">
          New to our platform?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create account
          </Link>
        </p>
      </Card>
      {error && <PopupNotification type="error" text={error} />}
    </div>
  );
};

export default Login;
