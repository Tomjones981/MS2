import React from "react";
// import Logo from "../../assets/images/OCC_LOGO.png";  
import Logo from "../../assets/images/mswd_logo.png"; 
import OpolLogo from "../../assets/images/opol_mswd_logo.png"; 

import { Navigate, Outlet } from "react-router-dom";
import { Flowbite } from "flowbite-react";
import { useStateContext } from "../../context/ContextProvider";
import LoadingScreen from "../components/LoadingScreen"; 
const AuthLayout = () => {
  const { token, user, loading } = useStateContext();
  if (loading) {
    return (
      <div>
        {" "}
        <LoadingScreen />{" "}
      </div>
    );
  }

  if (token) {
    if (user.user_type === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.user_type === "payroll") {
      return <Navigate to="/payroll/dashboard" />;
    } else if (user.user_type === "faculty") {
      return <Navigate to="/faculty/dashboard" />;
    }
  }

  return (
    <Flowbite>
      
      <div className="">
        {/* <header className="bg-gradient-to-br from-red-900 via-red-600 to-red-900 hover:bg-gradient-to-bl text-white py-4 shadow-lg">
          <div className="ml-[-2px] container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={Logo} alt="MSWD Logo" className="w-12 h-12 rounded-full" />
              <h1 className="text-lg font-bold">
                Municipal Social Welfare And Development Office
              </h1>
              <img src={OpolLogo} alt="Opol Logo" className="w-14 h-14 rounded-full" />
            </div>
          </div>
        </header> */}
        <div className=" bg-white min-h-screen  flex items-center justify-center p-2  "> 
          <div className="bg-gradient-to-b from-red-900 via-red-600 to-red-900 hover:bg-gradient-to-bl flex p-6   border border-gray-300 rounded-lg shadow sm:max-w-3xl sm:gap-10 sm:p-10 max-sm:flex-col max-sm:gap-10 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex flex-col flex-1 border border-gray-100 bg-white items-center justify-center text-center rounded-xl"> 
              <img src={Logo} alt="OCC_LOGO" className="mb-5 w-[130px] transition transform hover:scale-110 rounded-full" />
              <h1 className="italic text-gray-800  font-semibold text-lg   dark:text-white">
                Municipal Social Welfare And Development Office
              </h1>
            </div>
            <div className="flex-1 sm:max-w-xs">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Flowbite>
  );
}; 
export default AuthLayout;
