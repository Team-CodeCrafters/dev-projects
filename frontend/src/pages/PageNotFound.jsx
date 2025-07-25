import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotFoundImage from '../assets/images/page-not-found-bg.png';
import Button from '../components/ui/Button';
const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white px-4 transition-colors duration-500 dark:bg-black">
      <div className="text-center">
        <motion.img
          src={NotFoundImage}
          alt="404 Not Found"
          className="mx-auto -mt-10 mb-4 max-w-[300px] md:max-w-[500px]"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
        <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl dark:text-white">
          Oops! Page Not Found
        </h1>
        <p className="dark:text-white-light mb-6 text-gray-700">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="grid place-items-center">
          <Button
            onClick={() => navigate('/dashboard')}
            text={'Go to Home'}
            styles={'!w-20'}
            className="bg-primary hover:bg-secondary rounded-lg px-6 py-2 text-white transition"
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
