import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  });
  return (
    <h1 className="title-text dark:bg-black-medium h-full w-full dark:text-white">
      Started Projects
    </h1>
  );
};
export default Dashboard;
