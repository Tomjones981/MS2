import { useState } from 'react';
import { useStateContext } from '../../../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../axiosClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Swal from 'sweetalert2'

const Login = () => {
  const { sendOtp, verifyOtp } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // To track if OTP was sent
  const [passwordVisible, setPasswordVisible] = useState(false); // To toggle password visibility
  const navigate = useNavigate();

  // const handleSendOtp = async (e) => {
  //   e.preventDefault();
  //   if (!email || !password) return alert('Please enter both email and password.');

  //   setLoading(true);
  //   try {
  //     const response = await axiosClient.post('/validate-credentials', { email, password });
  //     if (response.data.valid) {
  //       await sendOtp(email, password);
  //       setOtpSent(true);  
  //       setStep(2);  
  //     } else {
  //       alert('Invalid credentials. Please check your email and password.');
  //     }
  //   } catch (error) {
  //     alert('Failed to validate credentials: ' + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSendOtp = async (e) => {
    e.preventDefault();
   
    if (!email || !password) {
      Swal.fire({
        title: "Error",
        text: "Please enter both email and password.",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK",
        customClass: {
          popup: "bg-gray-800 dark:bg-gray-200 shadow-xl rounded-lg p-2",
          title: "text-lg font-bold text-gray-200 dark:text-white",
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
          icon: "text-red-500",
        },
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await axiosClient.post('/validate-credentials', { email, password });
  
      if (response.data.valid) { 
        Swal.fire({
          title: "Correct Credential", 
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
   
        await sendOtp(email, password);
        setOtpSent(true);   
        setStep(2);  
      } else { 
        Swal.fire({
          title: "Invalid Credentials",
          text: "Please check your email and password.",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "Try Again",
          customClass: {
            popup: "bg-gray-800 dark:bg-gray-200 shadow-xl rounded-lg p-2",
            title: "text-lg font-bold text-gray-200 dark:text-white",
            confirmButton:
              "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
            icon: "text-red-500",
          },
        });
      }
    } catch (error) { 
      Swal.fire({
        title: "Error",
        text: "Failed to validate credentials: " + error.message,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK",
        customClass: {
          popup: "bg-gray-800 dark:bg-gray-200 shadow-xl rounded-lg p-2",
          title: "text-lg font-bold text-gray-200 dark:text-white",
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
          icon: "text-red-500",
        },
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert('Please enter the OTP.');
    setLoading(true);
    try {
      await verifyOtp(email, otp, navigate);  
    } catch (error) {
      alert('Failed to verify OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return alert('Please enter your email first.');
    setLoading(true);
    try {
      await sendOtp(email, password);  
      setOtpSent(true);   
      alert('OTP resent successfully.');
    } catch (error) {
      alert('Failed to resend OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-4">
        <h1 className="text-2xl font-semibold text-center text-gray-200">{step === 1 ? 'Login' : 'Verify OTP'}</h1>

        {step === 1 && (
          <>
            <div>
              <label className="mt-2 block text-sm font-medium text-gray-200">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
              />
            </div>

            <div className="relative">
              <label className="mt-2 block text-sm font-medium text-gray-200 ">Password</label>
              <input 
                type={passwordVisible ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
              />
              <div 
                className="absolute inset-y-0 right-1 pr-3 flex items-center cursor-pointer" 
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FaEye className="h-4 w-4 text-gray-500 mt-6" />
                ) : (
                  <FaEyeSlash className="h-4 w-4 text-gray-500 mt-6" />
                )}
              </div>
            </div>

            {/* <div className="my-4 border-t border-gray-300"></div>   */}

            {otpSent && (
              <div className="mt-2">
                <button type="button" onClick={handleResendOtp} className="text-blue-600 hover:underline" disabled={loading}>
                  Resend OTP
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-800">Enter OTP</label>
            <div className="flex space-x-2 ml-4">
              {Array(6).fill('').map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) return; // Allow only numbers
                    
                    const newOtp = otp.split('');
                    newOtp[index] = value;
                    setOtp(newOtp.join(''));
          
                    if (value && index < 5) {
                      document.getElementById(`otp-${index + 1}`).focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      document.getElementById(`otp-${index - 1}`).focus();
                    }
                  }}
                  id={`otp-${index}`}
                  className="w-10 h-10 text-center text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
          </div>
        
        )}

        <button type="submit" className="w-full h-10 p-3 text-gray-200 bg-gray-900 rounded-md hover:bg-gray-800 flex justify-center items-center mt-5" disabled={loading}>
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                ></path>
              </svg>
            </>
          ) : (
            <>
              {step === 1 ? 'Send OTP' : 'Verify OTP'}
            </>
          )}
        </button>
      </form>

      {step === 1 && (
        <div className="text-center mt-4  ">
          <button className="text-gray-200 hover:underline">
            <a href="/forgot_password">Forgot Password?</a>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center mt-4">
          <button type="button" onClick={handleResendOtp} className="text-blue-600 hover:underline" disabled={loading}>
            Didn't receive the code? Resend
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
