import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { signUpDataAtom } from '../store/atoms/userAtoms';
import useFetchData from '../hooks/useFetchData';

import InputField from '../components/ui/InputField';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

import logo from '../assets/images/dev-projects-dark.png';

const Signup = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  });

  const [signUpData, setSignUpData] = useRecoilState(signUpDataAtom);
  const { fetchData, error: serverError, loading } = useFetchData();
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (signUpData.password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    };

    const response = await fetchData('/user/signup', options);
    if (response?.data.token) {
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="mb-4 mt-2 text-center text-3xl font-semibold">
          Create an account
        </h2>

        <div className="h-6 text-center text-sm text-red-500">
          {localError || serverError || ''}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <InputField
            type="text"
            placeholder="Username"
            value={signUpData.username}
            isRequired={true}
            pattern="^[a-zA-Z0-9_]+$"
            title={'username can only contain letters, numbers and underscore'}
            onChange={(e) =>
              setSignUpData((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
          <InputField
            type="email"
            placeholder="Email"
            value={signUpData.email}
            isRequired={true}
            onChange={(e) =>
              setSignUpData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <InputField
            type="password"
            placeholder="Password"
            value={signUpData.password}
            isRequired={true}
            onChange={(e) =>
              setSignUpData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <Button text={loading ? <Loader /> : 'Sign Up'} />
        </form>

        <p className="mt-5 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
