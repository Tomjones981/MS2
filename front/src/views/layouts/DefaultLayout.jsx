import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { NavLink,  Navigate, Outlet, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt2, HiOutlineLogout, HiChartPie, HiClipboardList, HiChevronUp, HiChevronDown } from "react-icons/hi";
import { Menu,  Logout as LogoutIcon, PieChartOutline, Assignment,PieChartOutlined, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Avatar, DarkThemeToggle, Flowbite } from "flowbite-react";
import LoadingScreen from "../components/LoadingScreen";
import { FaUsers, FaRegCalendarCheck, FaChalkboardTeacher, FaHandHoldingUsd, FaProjectDiagram    } from "react-icons/fa";
import { FiUser, FiSettings, FiLogOut, FiBook } from "react-icons/fi";
import { Group, EventAvailable, School, MonetizationOn } from "@mui/icons-material";
import Logo from "../../assets/images/OCC_LOGO.png"; 
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import axiosClient from "../../api/axiosClient"; 
import { BeatLoader } from "react-spinners";
import Swal from 'sweetalert2' 
import { CalculateOutlined } from "@mui/icons-material";
 

const DefaultLayout = () => {
  const { user, token, setUser, setToken, loading } = useStateContext();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [sidebarState, setSidebarState] = useState({
    departmentOpen: false,
    facultyOpen: false,
    scheduleOpen: false,
    attendanceOpen: false,
    workloadOpen: false,
    degreeOpen: false,
    payrollOpen: false,
    calculationsOpen: false,
  });
  const [isOpen, setIsOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  }; 
  const handleProfileClick = () => {
    navigate("/admin/profile");  
  };

  const onLogout = async (ev) => {
    ev.preventDefault();
    setLoadingLogout(true);

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
    });

    if (!result.isConfirmed) {
        setLoadingLogout(false);
        return;
    }

    try {
        await axiosClient.post("/logout", {}, {
            headers: {
                Authorization: `Bearer ${token}`  
            }
        });
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); 
        
        Swal.fire({
            icon: 'success',
            title: 'Logged out!',
            text: 'You have been successfully logged out.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            navigate("/login");  // Navigate to the login page
            window.location.reload();  // Reload the page to ensure fresh login state
        });
        
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        
        Swal.fire({
            icon: 'error',
            title: 'Logout failed!',
            text: 'Please try again.',
        });
    } finally {
        setLoadingLogout(false);  
    }
};


  

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSection = (section) => {
    setSidebarState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const renderAdminSidebar = () => (
    <>  
      <div className="mb-8 -mt-3 text-white flex items-center ml-2">
        <img src={Logo} alt="occ_logo" className="w-12 h-12" />
        {isOpen && <span className="text-1xl font-extrabold ml-2">ATTENDANCE</span>}
      </div>
      <nav>
        <NavLink to="/" onClick={() => handleItemClick("dashboard")} className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${activeItem === "dashboard" ? "bg-white text-black" : "" }`} > <HiChartPie size={23} className="mr-3" /> {isOpen && "Dashboard"} </NavLink> 
        {renderSidebarSection("Department", FaChalkboardTeacher, null, null, "departmentOpen", [ { label: "Add Department", path: "/department/add" }, { label: "Department Info", path: "/department/list" }, ])}
        {renderSidebarSection("Faculty", FaUsers, null, null, "facultyOpen", [ { label: "Add Faculty", path: "/create_faculty" }, { label: "Faculty List", path: "/faculty" }, ])} 
        <NavLink to="/schedule/list" onClick={() => handleItemClick("/schedule/list")} className={`mt-1 flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${ activeItem === "/schedule/list" ? "bg-gradient-to-br from-gray-300 to-gray-600 text-gray-800" : "" }`} > <EventAvailable size={23} className="mr-3" /> {isOpen && "Schedule"} </NavLink>
        <NavLink to="/attendance/record" onClick={() => handleItemClick("/attendance/record")} className={`mt-1 flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${ activeItem === "/attendance/record" ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800" : "" }`} > <Assignment  size={23} className="mr-3" /> {isOpen && "Attendance"} </NavLink>
        {/* <NavLink to="/attendance/import" onClick={() => handleItemClick("/attendance/import")} className={`mt-1 flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${ activeItem === "/attendance/import" ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800" : "" }`} > <Assignment  size={23} className="mr-3" /> {isOpen && "Attendance Import "} </NavLink> */}
        <NavLink to="/employment/list" onClick={() => handleItemClick("/employment/list")} className={`mt-1 flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${ activeItem === "/employment/list" ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800" : "" }`} > <AssignmentIndIcon size={23} className="mr-3" /> {isOpen && "Employment"} </NavLink> 
        {renderSidebarSection("Work Load", FaProjectDiagram  , null, null, "workloadOpen", [  { label: "workload", path: "/workload/part_time" }, ])} 
        {renderSidebarSection("Calculations", CalculateOutlined  , null, null, "calculationsOpen", [  { label: "Part Time", path: "/admin/part/time" },  { label: "Full Time", path: "/admin/full/time" },  { label: "Extra Load", path: "/admin/extra/load" },  { label: "PT-Regular", path: "/admin/part/time/regular" }, { label: "Program Heads", path: "/admin/program/heads" },])} 
      </nav>
    </>
  );

  const renderPayrollSidebar = () => (
    <>
      <div className="mb-8 -mt-3 text-white flex items-center ml-2">
        <img src={Logo} alt="occ_logo" className="w-12 h-12" />
        {isOpen && <span className="text-1xl font-extrabold ml-2">PAYROLL</span>}
      </div>
      <nav>
        <NavLink to="/" onClick={() => handleItemClick("dashboard")} className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${ activeItem === "dashboard" ? "bg-white text-black" : "" }`} > <PieChartOutline size={23} className="mr-3" /> {isOpen && "Dashboard"} </NavLink>
        {renderSidebarSection("Payroll Info", FaHandHoldingUsd, null, null, "payrollOpen", [  { label: "History", path: "/payroll/history/full/time" }, { label: "History Adjustment", path: "/payroll/history/ad/time" },  ])}
       
      </nav>
    </>
  );

  const renderSidebarSection = (title, Icon, link1, link2, stateKey, subLinks = []) => (
    <div className="space-y-1">
      <button onClick={() => toggleSection(stateKey)} className={`mt-1 flex items-center justify-between py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 w-full text-left`} > <div className="flex items-center"> <Icon size={23} className="mr-3" /> {isOpen && title} </div> {sidebarState[stateKey] ? ( <HiChevronUp size={23} className="ml-auto" /> ) : ( <HiChevronDown size={23} className="ml-auto" /> )} </button>
      {sidebarState[stateKey] && (
        <div className="pl-8">
          {subLinks.length > 0 &&
            subLinks.map((subLink) => (
              <NavLink key={subLink.path} to={subLink.path} onClick={() => handleItemClick(subLink.path)} className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${ activeItem === subLink.path ? "bg-white text-black" : "" }`} > {isOpen && subLink.label} </NavLink>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <Flowbite>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="min-h-screen flex">
            <div className={`min-h-screen fixed border border-gray-500 dark:border-gray-700 transition-all duration-300 ${isOpen ? "w-72" : "w-16"}`}>
              <div className={`bg-gradient-to-br from-gray-800 to-gray-800 text-gray-200 py-7 px-2 overflow-y-scroll h-screen custom-scrollbar ${isOpen ? "w-72" : "w-16"}`}>
                {user.user_type === "admin" && renderAdminSidebar()}
                {user.user_type === "payroll" && renderPayrollSidebar()}
              </div>
            </div>

            <div className={`flex flex-col flex-1 transition-all duration-300 ${isOpen ? "ml-72" : "ml-16"} bg-gray-100 dark:bg-gray-900`}>
              <header className="bg-white shadow-md py-4 px-4 border border-gray-200 flex items-center justify-start fixed w-full dark:border-gray-700 dark:bg-gray-800 z-10">
                <button onClick={toggleSidebar} className="flex p-1 hover:bg-gray-100 rounded-md dark:text-white dark:hover:bg-gray-700" > <HiOutlineMenuAlt2 className="text-3xl text-gray-700 dark:text-white" /> </button>
                <div className={`ml-[48rem] flex items-center transition-all duration-300 ${isOpen ? 'ml-0' : 'ml-[62rem]'}`} >
                  <div className="relative"> 
                    <button onClick={toggleProfileMenu} className="border border-gray-200 shadow rounded-full hover:bg-gray-100 flex items-center px-2" >
                      <Avatar rounded className="text-white mr-2" />
                      <div className="hidden sm:block text-left">
                        <p className="text-gray-700 dark:text-white font-medium">Administrator</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">A & P</p>
                      </div>
                    </button> 
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg dark:bg-gray-800 z-20   ">
                        <div className="p-4 border-b dark:border-gray-700"> 
                        </div>
                        <ul>
                          <li>
                            <button  onClick={handleProfileClick} className="w-full text-left px-4 py-2 flex items-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"> <FiUser className="mr-2" /> My Profile </button>
                          </li>
                          <li>
                            <button className="w-full text-left px-4 py-2 flex items-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"> <FiBook className="mr-2" /> My Contacts </button>
                          </li>
                          <li>
                            <button className="w-full text-left px-4 py-2 flex items-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"> <FiSettings className="mr-2" /> Account Settings </button>
                          </li>
                          <li>
                            <button onClick={onLogout} className="w-full text-left px-4 py-2 flex items-center text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700" disabled={loadingLogout} > {loadingLogout ? ( <span className="mr-2"><BeatLoader/></span> ) : ( <> <FiLogOut className="mr-2" /> Log Out </> )} </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div> 
                  <DarkThemeToggle className="ml-4 border border-gray-200 shadow" />
                </div>
              </header>
            
              <main className="mt-6 pt-16 p-4 flex-1">
                <div className={`flex-1 overflow-auto p-4 lg:p-2 transition-all duration-300`}>
                  <Outlet context={{ isOpen }} /> 
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </Flowbite>
  );
};

export default DefaultLayout;
