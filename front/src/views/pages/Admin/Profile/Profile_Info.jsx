import React, { useState, useEffect } from 'react';
import axiosClient from '../../../../api/axiosClient'  
import Logo from '../../../../assets/images/admino.jpg';

const Profile_Info = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null); // For displaying any error messages
  
  const token = localStorage.getItem('token');  

  const getUser = async () => {
    if (token) {
      try {
        const { data } = await axiosClient.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        });
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
    getUser();
  }, []);
   
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await axiosClient.post(
        '/change-password',
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: retypeNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);   
    } catch (error) {
      console.error('Password change failed:', error.response.data.message);
      alert(error.response.data.message);  
    }
  };
  
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <>
      <div className='grid grid-cols-7 gap-4'>
        <div className='col-span-2 flex flex-col items-center justify-center p-4 border border-gray-200 bg-white rounded-md dark:bg-gray-800 dark:border-gray-700 shadow-md'>
            <div className='flex flex-col items-center'>
                <h1 className="font-bold text-lg dark:text-gray-300 mb-2 text-center"> 
                  {user.user_type === "admin" ? "Administrator" : 
                   user.user_type === "payroll" ? "Payroll Manager" : 
                   user.user_type === "faculty" ? "Faculty" : "Unknown"} 
                </h1>
                <img className="w-36 h-36 mb-4 rounded-full" src={Logo} alt="FACULTY PROFILE" />
                <h1 className="font-bold text-lg dark:text-gray-300 text-center">{user.email}</h1>
            </div>
        </div>

        <div className='col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200'>
          <h1 className="mb-5 font-semibold text-xl dark:text-white uppercase">Account Information</h1>
          <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-700" style={{ width: '107.5%' }}/>

          <form onSubmit={handleChangePassword}>
            <div className='grid grid-cols-1 justify-end'>
                <div>
                    <label htmlFor="current_password" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      id="current_password" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password" 
                      required 
                    />
                </div>
                <div>
                    <label htmlFor="new_password" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      id="new_password" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password" 
                      required 
                    />
                </div>
                <div>
                    <label htmlFor="retypenew_password" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Re-type New Password
                    </label>
                    <input 
                      type="password" 
                      id="retypenew_password" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={retypeNewPassword}
                      onChange={(e) => setRetypeNewPassword(e.target.value)}
                      placeholder="Re-type New Password" 
                      required 
                    />
                </div>
                {passwordError && (
                  <div className="text-red-600 mt-2 text-sm">
                    {passwordError}
                  </div>
                )}
                <div className='flex items-center justify-end mt-6'>
                    <button 
                      type="submit" 
                      className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Submit
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile_Info;
