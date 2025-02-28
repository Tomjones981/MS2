import React, { useState, useEffect } from 'react';
import axiosClient from '../../../../api/axiosClient'  
import Logo from '../../../../assets/images/admino.jpg';
import Bg from '../../../../assets/bg/curved0.jpg'
import Avatar from '../../../../assets/images/adminMalyn.jpg'
import { FaCogs, FaMapMarkerAlt, FaComments, FaAppStore } from "react-icons/fa";
import { Modal } from 'flowbite-react';
import { message } from 'antd' 

const Profile_Info = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null); 
  const [openForgotPass, setOpenForgotPass] = useState(false);
  
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
      // alert(response.data.message);  
      message.success(response.data.message) ;
    } catch (error) {
      console.error('Password change failed:', error.response.data.message);
      // alert(error.response.data.message);  
      message.error(error.response.data.message);
    }
  };
  
  
  if (loading) {
    return <div className='mt-20'> 
      <div role="status" class="animate-pulse">
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
          <div class="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
          <div class="flex items-center justify-center mt-4">
              <svg class="w-8 h-8 text-gray-200 dark:text-gray-700 me-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
              </svg>
              <div class="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
              <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <span class="sr-only">Loading...</span>
      </div> 
    </div>;
  }
  
  if (!user) {
    return <div>No user data available</div>;
  }


  return (
    <>
      <div className='p-5  '>
          <div className="h-[300px] flex flex-col justify-center p-4 border border-gray-200 rounded-2xl dark:border-gray-700 shadow-md" style={{ backgroundImage: `url(${Bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
            <div>
              <h1 className="text-white font-serif -mt-[13rem]">Profile</h1>
            </div>

            <div className='flex justify-end -mt-[13rem]'>
              <div className="relative col-span-3 flex items-end">
                <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-6">
                  <svg className="mb-5 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="search"    className="font-serif block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search here..." />
              </div>
            <div className='mt-2'>
                {/* <h1 className="text-white font-serif ml-2">Forgot Password</h1> */}
                <button onClick={() => {setOpenForgotPass(true); }} className='text-white font-serif ml-2 underline'>Forgot Password</button>
              </div>
            </div>
          </div>
      </div>

      <div className='p-5 -mt-[7rem]'>
        <div className='m-5 p-4 border border-gray-200 bg-white rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-md'>
           
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <img className="rounded-lg h-16 w-16" src={Avatar} alt="Profile Avatar" />  
              <h1 className="font-serif font-bold text-lg dark:text-gray-300">
                {user.user_type === "admin" ? "Administrator" : 
                user.user_type === "payroll" ? "Payroll Manager" : 
                user.user_type === "faculty" ? "Faculty" : "Unknown"} 
              </h1>
            </div>
 
            <div className='flex items-center gap-6 text-gray-600 dark:text-gray-300'>
              <div className=" flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <FaAppStore size={18} /> <span className='font-serif'>App</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <FaComments size={18} /> <span className='font-serif'>Messages</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <FaMapMarkerAlt size={18} /> <span className='font-serif'>Location</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <FaCogs size={18} /> <span className='font-serif'>Settings</span>
              </div>
            </div>
          </div> 
        </div>
      </div>

      <div className='p-5 -mt-10'>
        <div className='grid grid-cols-3 gap-5'>
          {/* Platform Settings */}
          <div className='p-6 border border-gray-200 bg-white rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-lg'>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>Platform Settings</h1>
            <h2 className='text-lg font-medium text-gray-700 dark:text-gray-300'>Accounts</h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
              Manage security settings, account preferences, and connected devices.
            </p>
            <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
              Manage Account
            </button>
          </div>

          {/* Profile Information */}
          <div className='p-6 border border-gray-200 bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 shadow-lg'>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>Profile Information</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Update your name, email, and profile picture to keep your account up to date.
            </p>
            <button className='mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'>
              Edit Profile
            </button>
          </div>

          {/* Conversations */}
          <div className='p-6 border border-gray-200 bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 shadow-lg'>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>Conversations</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              View and manage your messages, notifications, and chat preferences.
            </p>
            <button className='mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'>
              Open Messages
            </button>
          </div>
        </div>
      </div>


      {/* <div className='grid grid-cols-7 gap-4'>
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
      </div> */}
      
      <Modal show={openForgotPass} size='md'  onClose={() => setOpenForgotPass(false)}>
        <Modal.Header>
          <h1 className='font-serif'>Change Password</h1>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleChangePassword}>
            <div className='grid grid-cols-1 justify-end font-serif'>
                <div>
                    <label htmlFor="current_password" className="font-serif mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      id="current_password" 
                      className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password" 
                      required 
                    />
                </div>
                <div>
                    <label htmlFor="new_password" className="font-serif mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      id="new_password" 
                      className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password" 
                      required 
                    />
                </div>
                <div>
                    <label htmlFor="retypenew_password" className="font-serif mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Re-type New Password
                    </label>
                    <input 
                      type="password" 
                      id="retypenew_password" 
                      className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                      className="font-serif text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Submit
                    </button>
                </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Profile_Info;
