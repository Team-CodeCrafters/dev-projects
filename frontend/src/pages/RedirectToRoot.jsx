import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToRoot = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard', { replace: true });
    else navigate('/login', { replace: true });
  }, []);
  return <></>;
};

export default RedirectToRoot;
