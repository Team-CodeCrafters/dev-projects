import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotFoundImage from "../assets/images/page-not-found-bg.png";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-black px-4 transition-colors duration-500">
      <div className="text-center">
        <motion.img
          src={NotFoundImage}
          alt="404 Not Found"
          className="mx-auto max-w-[300px] md:max-w-[500px] -mt-10 mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
        <h1 className="text-black dark:text-white text-3xl md:text-4xl font-bold mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-700 dark:text-white-light mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
