import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { signInDataAtom } from '../store/atoms/userAtoms.jsx';
import useFetchData from '../hooks/useFetchData.jsx';

const Login = () => {
  const [signInData, setSignInData] = useRecoilState(signInDataAtom);
  const [fetchData, error, loading] = useFetchData();
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
    localStorage.setItem('token', response.token);
    if (response) navigate('/dashboard');
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="text"
          onChange={(e) =>
            setSignInData((prev) => ({
              ...prev,
              identifier: e.target.value,
            }))
          }
          required
        />
        <input
          type="password"
          name="password"
          onChange={(e) =>
            setSignInData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          required
        />
        <button>{loading ? 'loading...' : 'Sign In'}</button>
        {error && <div>Error occured: {error}</div>}
      </form>
    </div>
  );
};

export default Login;
