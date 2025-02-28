import { useState } from 'react';
import { useStateContext } from '../../../context/ContextProvider';
import { useNavigate } from 'react-router-dom';

const Forgot_Password = () => {
  const { sendOtp, verifyOtp } = useStateContext();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email ) return alert('Please enter  email');
    setLoading(true);
    try {
      await sendOtp(email, password);  
      setStep(2);  
    } catch (error) {
      alert('Failed to send OTP: ' + error.message);
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
  const handleCHangePassword = async (e) => {
    e.preventDefault();
    setStep(3);
  }

  return (
    <>
      <div>
        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 1 ? 'Verify Email' : 'Verify OTP'}
          </h1>

          {step === 1 && (
            <>
              <div className=''>
                <label className="block mb-1 text-sm font-medium text-gray-800 dark:text-white">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
              </div> 
            </>
          )}

          {step === 2 && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-800 dark:text-white">OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
            </div>
          )}

          {step === 3 && (
             <div>
              <label className="block mb-1 text-sm font-medium text-gray-800 dark:text-white"> Change Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
           </div>
          )}

          <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 p-2 rounded" disabled={loading} >
            {loading ? 'Processing...' : step === 1 ? 'Reset Password' : 'Verify OTP'}
          </button>
        </form>
        
        <button className='w-full p-2  underline'>
          <a href='/login' className='mt-5'>
            Login
          </a>
        </button>
      </div>
    </>
    
  );
};

export default Forgot_Password;