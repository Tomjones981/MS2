import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className=" -mt-20 flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="font-serif text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="font-serif text-gray-600 mb-6">Oops! The page you are looking for does not exist.</p>
      <button 
        onClick={() => navigate('/')} 
        className="font-serif px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFound;
