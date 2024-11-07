 
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt2, HiOutlineLogout, HiChartPie, HiClipboardList, HiCalendar, HiChevronUp, HiChevronDown, } from "react-icons/hi";
import { Avatar, DarkThemeToggle, Sidebar } from "flowbite-react";
import LoadingScreen from "../components/LoadingScreen";
import { FaUsers } from "react-icons/fa";
import Logo from "../../assets/images/OCC_LOGO.png";
import { IoDocumentText } from "react-icons/io5";
import { RiFileHistoryFill } from "react-icons/ri";
import axiosClient from "../../api/axiosClient";
import { Flowbite } from "flowbite-react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaCalendarPlus } from 'react-icons/fa';
import { FaCalendarDay } from 'react-icons/fa';
import SchoolIcon from '@mui/icons-material/School';  
import { FaCalendarAlt } from 'react-icons/fa';
import { IoSettingsSharp } from "react-icons/io5";  
import {  FaChalkboardTeacher } from 'react-icons/fa';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
 
 
const PayrollLayout = () => {
  const { user, token, setUser, setToken, loading } = useStateContext();
  const [activeItem, setActiveItem] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDegreeOpen, setIsDegreeOpen] = useState(false);
  const [sidebarAlignment, setSidebarAlignment] = useState('left');
  const navigate = useNavigate();

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.get("/logout").then(() => {
      setUser(null);
      setToken(null);
      navigate("/login");
    });
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  const handleSidebarToggle = (event, newAlignment) => {
    if (newAlignment !== null) {
      setSidebarAlignment(newAlignment);
      setIsOpen(newAlignment === 'left');
    }
  };
  return (
    <Flowbite>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="min-h-screen flex ">
            <div className={`-ml-0.4 min-h-screen flex fixed border border-gray-500 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'w-72' : 'w-16'}`}>
              <div className={`bg-gradient-to-br from-gray-800 to-gray-800 text-gray-200 space-y-6 py-7 px-2 overflow-y-scroll h-screen custom-scrollbar ${isOpen ? 'w-72' : 'w-16'}`}>
                {user.role === 'admin' && (
                  <>
                    <div className="text-white flex items-center -ml-20">
                      <img src={Logo} alt="occ_logo" className="-mt-3 w-12 h-12 flex justify-center items-center ml-20" />
                      <div className={`-mt-4 ml-2 ${isOpen ? 'block' : 'hidden'}`}>
                        <div className="flex justify-center">
                          <span className="text-1xl font-extrabold -ml-1">PAYROLL</span>
                        </div>
                      </div>
                    </div>
                    <nav>
                      <NavLink
                        to="/"
                        onClick={() => handleItemClick("dashboard")}
                        className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${activeItem === "dashboard" ? "bg-white hover:bg-white-800 rounded-xl text-black" : ""}`}
                      >
                        <HiChartPie size={23} className="mr-3" /> {isOpen && "Dashboard"}
                      </NavLink>
                    </nav>
                  </>
                )} 
              </div>
            </div>

          
            <div className={`flex flex-col flex-1  transition-all duration-300 ${isOpen ? '' : '-ml-56 w-[80rem]'}`}>
              {/* Header */}
              <header className="bg-white shadow-md py-4 px-4  border border-gray-200  flex items-center justify-between w-[67rem] fixed ml-72 dark:border-gray-700  dark:bg-gray-800 -mr-8">
                <button
                  // onClick={() => setIsOpen(!isOpen)}
                  className="z-20 flex p-1 hover:bg-gray-100 rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  <HiOutlineMenuAlt2 className=" text-3xl text-gray-700 dark:text-white" />
                </button>
              
                  
                
                  <div className="flex items-center">
                    <button className="border border-gray-200 shadow rounded-full hover:bg-gray-100 ">
                    <Avatar   rounded className="text-white"/>
                    </button>
                    <DarkThemeToggle className="ml-2 border border-gray-200 shadow" />
                    <button onClick={onLogout}>
                      <HiOutlineLogout size={26} className="ml-4 dark:text-white" />
                    </button>
                  </div>
              
              </header>
            </div>
          </div>

          <div
            className={`bg-gray-100 dark:bg-gray-900 ml-64 p-4 min-h-screen -mt-[35rem] ml-[18rem] transition-all duration-300
              ${ isOpen ? 'ml-72 ' : 'ml-16' }`} >
            <div className="max-w-5xl mx-auto">
              <Outlet context={{ isOpen }} />
            </div>
          </div>
        </>
      )}
    </Flowbite>
  );
};

export default PayrollLayout;
