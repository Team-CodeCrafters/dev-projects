import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { signInDataAtom } from '../store/atoms/userAtoms';
import useFetchData from '../hooks/useFetchData';
import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import logo from '../assets/images/dev-projects-dark.png';
import usePopupNotication from '../hooks/usePopup';

const Login = () => {
  const showPopup = usePopupNotication();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/dashboard';
    }
  });

  const [signInData, setSignInData] = useRecoilState(signInDataAtom);
  const { fetchData, loading } = useFetchData();
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
      showPopup('error', response.error);
    }
  }

  return (
    <div className="px- flex min-h-screen items-center justify-center bg-black">
      <Card>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="font-heading mb-4 mt-2 text-center text-3xl font-semibold">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              className="text-sm text-blue-400 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Button Content={loading ? <Loader /> : 'Log In'} />
        </form>

        <div className="mt-5 text-center text-sm text-gray-400">
          New to our platform?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
