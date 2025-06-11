import { useRecoilState } from 'recoil';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { signUpDataAtom } from '../store/atoms/userAtoms.jsx';
import useFetchData from '../hooks/useFetchData.jsx';
import InputField from '../components/InputField.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import logo from '../assets/images/logo-icon.png';

const Signup = () => {
  const [signUpData, setSignUpData] = useRecoilState(signUpDataAtom);
  const { fetchData, error: serverError, loading } = useFetchData();
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

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
    if (response?.token) {
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] px-4">
      <Card>
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="mt-2 mb-4 text-center text-3xl font-semibold">
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
