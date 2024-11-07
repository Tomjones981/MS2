import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useStateContext } from '../../../context/ContextProvider';
import SpinnerButton from '../../components/SpinnerButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, btnLoading } = useStateContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Login</h1>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Username</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Password</label>
        <div className="relative">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 dark:text-gray-300 border-l border-gray-300 pl-2 dark:border-gray-500" >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>
      <button 
        type="submit" 
        className="flex items-center justify-center gap-2 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
        disabled={btnLoading}
      >
        {btnLoading ? (
          <>
            <SpinnerButton />Logging in
          </>
        ) : (
          <>
            Login
          </>
        )}
      </button>
    </form>
  );
};

export default Login;
