import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient"; 
import Swal from 'sweetalert2'
const stateContext = createContext({});
import { useNavigate } from 'react-router-dom';
import {  message } from 'antd'; 


export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const updateToken = (token) => {
    setToken(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  const getUser = async () => {
    if (token) {
      try {
        const { data } = await axiosClient.get('/user');
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
    };
    fetchUser();
  }, [token]);

  const login = async ({ email, password }) => {
    try {
      const response = await axiosClient.post('/login', { email, password });
  
      if (response.data && response.status === 200) {
        const { message, token, user_type } = response.data;
  
        Swal.fire({
          title: "Login Successful", 
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "Continue",
          customClass: {
            popup: "bg-gray-800 dark:bg-gray-200 shadow-xl rounded-lg p-2",
            title: "text-lg font-bold text-gray-200 dark:text-white",
            confirmButton:
              "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
            icon: "text-green-500",
          },
        });
  
        updateToken(token);
  
        await getUser();
        return { success: true }; // Return success for OTP step
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        title: "Login failed",
        text: "Invalid credentials or some other error",
        icon: "error",
      });
      return { success: false }; // Return failure for OTP step
    }
  };

  const sendOtp = async (email, password) => {
    try {
      const response = await axiosClient.post('/send-otp', { email, password });  
      message.success(response.data.message);   
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send OTP.');
    }
  };
   

  const verifyOtp = async (email, otp, navigate) => {
    try {
      const response = await axiosClient.post('/verify-otp', { email, otp });
      updateToken(response.data.token);
      await getUser();
      message.success(response.data.message);
      navigate('/'); // Redirect to dashboard after successful verification
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to verify OTP.');
    }
  };

 
 
  return (
    <stateContext.Provider value={{ user, setUser, setToken, token, loading, btnLoading, login, sendOtp, verifyOtp  }}>
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);
