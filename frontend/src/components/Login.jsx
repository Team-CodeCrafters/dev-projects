import { useRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { signInDataAtom } from '../store/atoms/userAtoms.jsx';
import useFetchData from '../hooks/useFetchData.jsx';
import InputField from '../components/InputField.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import logo from '../assets/images/logo-icon.png';

const Login = () => {
  const [signInData, setSignInData] = useRecoilState(signInDataAtom);
  const { fetchData, error, loading } = useFetchData();
  const navigate = useNavigate();

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
    localStorage.setItem('token', response?.token);

    if (response) navigate('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] px-4">
      <Card>
        {/* ✅ Logo added here */}
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="mt-2 mb-4 text-center text-3xl font-semibold">
          Sign in to your account
        </h2>

        <div className="h-6 text-center text-sm text-red-500">
          {error || ''}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <InputField
            type="email"
            placeholder="Username or Email"
            value={signInData.identifier}
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
    </div>
  );
};

export default Login;
