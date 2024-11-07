import React from "react";
import Logo from "../../assets/images/OCC_LOGO.png";
import { Navigate, Outlet } from "react-router-dom";
import { Flowbite } from "flowbite-react";
import { useStateContext } from "../../context/ContextProvider";
import LoadingScreen from "../components/LoadingScreen";
const AuthLayout = () => {
  const { token, user,loading } = useStateContext()
  if (loading) { 
    return <div> <LoadingScreen/> </div>
  }

   if (token) {
    if (user.user_type === 'admin') {
      return <Navigate to='/admin/dashboard' />;
    } else if (user.user_type === 'payroll') {
      return <Navigate to='/payroll/dashboard' />;
    } else if (user.user_type === 'faculty') {
      return <Navigate to='/faculty/dashboard' />;
    }
  }
  

  return (
    <Flowbite>
      <div className="bg-gray-800 min-h-screen flex items-center justify-center p-4">
        <div className=" w-full flex p-6 bg-gray-100 border border-gray-200 rounded-lg shadow sm:max-w-3xl sm:gap-10 sm:p-10 max-sm:flex-col max-sm:gap-10 dark:bg-gray-900 dark:border-gray-700 ">
          <div className="flex flex-col flex-1 gap-4 items-center justify-center">
            <img src={Logo} alt="OCC_LOGO" className="w-[100px] transition transform hover:scale-110" />
            <h1 className="text-gray-800 font-bold text-2xl   dark:text-white">
              Attendance & Payroll
            </h1>
          </div>
          <div className="flex-1 sm:max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      
       
    </Flowbite>
  );
};

export default AuthLayout;
