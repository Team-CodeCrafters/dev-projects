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
    <>
      <h1 className="title-text dark:bg-black-medium dark:text-white">
        Started Projects
      </h1>
      <div className="h-[150vh]">this is main content</div>
    </>
  );
};
export default Dashboard;
