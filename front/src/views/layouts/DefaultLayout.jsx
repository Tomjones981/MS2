import Swal from "sweetalert2";
import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import axiosClient from "../../api/axiosClient";
import MailIcon from '@mui/icons-material/Mail';
import FolderIcon from '@mui/icons-material/Folder';
import Logo from "../../assets/images/mswd_logo.png";
import Logo2 from "../../assets/images/opol_mswd_logo.png";
import AdminLogo from '../../assets/images/adminMalyn.jpg'
import AdminLogo2 from '../../assets/images/admin2.png'
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useStateContext } from "../../context/ContextProvider";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Menu, Logout as LogoutIcon, PieChartOutlined, Assignment, ExpandLess, ExpandMore, ShoppingBagOutlined, DashboardOutlined, GroupOutlined, ChevronRight, VerifiedUserRounded } from "@mui/icons-material";
import { Avatar, DarkThemeToggle, Flowbite, } from "flowbite-react"; import LoadingScreen from "../components/LoadingScreen";
import { FaUsers, FaRegCalendarCheck, FaChalkboardTeacher, FaHandHoldingUsd, FaProjectDiagram } from "react-icons/fa";
import { Card, Typography, List, ListItem, ListItemPrefix, ListItemSuffix, Chip, Accordion, AccordionHeader, AccordionBody, Alert } from "@material-tailwind/react";
import {  FileText, Accessibility, AccessibilityIcon} from "lucide-react";
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
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [open, setOpen] = React.useState(0); 
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  
  const onLogout = async (ev) => {
    ev.preventDefault();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosClient.post("/logout");
      localStorage.removeItem("token");
      Swal.fire("Logged out!", "You have been successfully logged out.", "success").then(() => {
        navigate("/login");
        window.location.reload();
      });
    } catch (error) {
      Swal.fire("Logout failed!", "Please try again.", "error");
    }
  };

  const renderAdminSidebar = () => (
    <>
      {/* <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-gray-800 transform transition-transform dark:bg-gray-800 dark:text-gray-200 shadow-xl border border-gray-100 rounded-xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800`}> */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-gray-800 transform transition-transform dark:bg-gray-800 dark:text-gray-200 shadow-xl border border-gray-100 dark:border-gray-800 rounded-xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
        <div className="p-4 flex items-center  justify-between">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold font-serif ">MSWDO</span>
            <img src={Logo2} alt="Logo2" className="h-10 w-10 rounded-full" />
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-800 dark:text-gray-200">
            ✖
          </button>
        </div> 
          <List className="overflow-y-auto max-h-[550px]">
            <hr className="my-2 border-blue-gray-50 mt-[-9px] shadow-lg" />
            <Typography className="ml-4 font-serif  text-md">Menu</Typography>
            {/* <div className="m-3 bg-red-900 text-gray-200 border border-gray-200 rounded-md dark:text-gray-800 dark:bg-red-200">
              <Accordion open={open === 1} icon={ <ExpandMore className={`mx-auto h-4 w-4 transition-transform ${ open === 1 ? "rotate-180" : "" }`} /> } >
                <ListItem className="p-0" selected={open === 1}>
                  <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <DashboardIcon />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className=" font-serif">
                      Dashboard
                    </Typography>
                  </AccordionHeader>
                </ListItem> 
                <AccordionBody className="py-1">
                  <List className="p-0 text-gray-300 dark:text-gray-700 list-disc list-inside">  
                    <ListItem>
                      <NavLink 
                        to="/admin/report/pwd" 
                        className={({ isActive }) => `ml-2 font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-200"}`}
                      > 
                        <span className="mr-7 text-xl">•</span> PWD Report
                        <ListItemSuffix>
                          <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                        </ListItemSuffix>
                      </NavLink> 
                    </ListItem>
                  </List>
                </AccordionBody> 

              </Accordion>
      
              <Accordion open={open === 2} icon={ <ExpandMore className={`mx-auto h-4 w-4 transition-transform ${ open === 2 ? "rotate-180" : "" }`} /> } >
                <ListItem className="p-0" selected={open === 2}>
                  <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <div className="text-2xl">
                        <FaUsers />
                      </div>
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="ml-[-3rem] font-serif">
                      Users
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 text-gray-300 dark:text-gray-700 list-disc list-inside">  
                    <ListItem>
                      <NavLink 
                        to="/admin/dashboard" 
                        className={({ isActive }) => `ml-2 font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-200"}`}
                      > 
                        <span className="mr-7 text-xl">•</span> Dashboard
                        <ListItemSuffix>
                          <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                        </ListItemSuffix>
                      </NavLink> 
                    </ListItem>
                  </List>
                </AccordionBody> 
              </Accordion>
      
              <Accordion open={open === 3} icon={ <ExpandMore className={`mx-auto h-4 w-4 transition-transform ${ open === 3 ? "rotate-180" : "" }`} />  }>
                <ListItem className="p-0" selected={open === 3}>
                  <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <div className="text-2xl">
                        <FolderIcon />
                      </div>
                    </ListItemPrefix>
                    <Typography color="blue-gray" className=" font-serif">
                      Documents
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 text-gray-300 dark:text-gray-700">
                    <ListItem className="font-serif">
                      <ListItemPrefix>
                        <ChevronRight />
                      </ListItemPrefix>
                      Barangay
                    </ListItem>
                    <ListItem className="font-serif">
                      <ListItemPrefix>
                        <ChevronRight />
                      </ListItemPrefix>
                      Files
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion> 
            </div>  */}

            <hr className=" my-2 border-blue-gray-500 mt-[5px] shadow-lg" /> 
{/*             
            <ListItem>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-700"}` } >
                <ListItemPrefix>
                  <MailIcon />
                </ListItemPrefix>
                  Inbox
                <ListItemSuffix>
                  <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                </ListItemSuffix>
              </NavLink> 
            </ListItem> */}

            <Accordion open={open === 5} icon={ <ExpandMore className={`mx-auto h-4 w-4 transition-transform ${ open === 5 ? "rotate-180" : "" }`} /> } >
                <ListItem className="p-0" selected={open === 5}>
                  <AccordionHeader onClick={() => handleOpen(5)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <div className="text-2xl">
                        <DashboardIcon className="-mr-2"/>
                      </div>
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="ml-[-3rem] font-serif text-gray-600 dark:text-gray-300 ">
                      Dashboard
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="-py-1">
                  <List className="p-0  list-disc list-inside">  
                    <ListItem>
                      <NavLink 
                        to="/admin/report/pwd" 
                        className={({ isActive }) => `ml-2 font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-300"}`}
                      > 
                        <span className="mr-7 text-xl">•</span> PWD Report
                        <ListItemSuffix>
                          <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                        </ListItemSuffix>
                      </NavLink> 
                    </ListItem>
                  </List>
                </AccordionBody>
                 

              </Accordion>
 
            <ListItem>
              <NavLink to="/admin/records" className={({ isActive }) => `font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}` } >
                <ListItemPrefix>
                  <FileText className="mr-2"/>
                </ListItemPrefix>
                  Records
                <ListItemSuffix>
                  <Chip 
                  // value="14"
                   size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                </ListItemSuffix>
              </NavLink> 
            </ListItem> 

            <Accordion open={open === 4} icon={ <ExpandMore className={`mx-auto h-4 w-4 transition-transform ${ open === 4 ? "rotate-180" : "" }`} /> } >
                <ListItem className="p-0" selected={open === 4}>
                  <AccordionHeader onClick={() => handleOpen(4)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <div className="text-2xl">
                        <AccessibilityIcon className="-mr-2"/>
                      </div>
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="ml-[-3rem] font-serif text-gray-600 dark:text-gray-300 ">
                      PWD List
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="-py-1">
                  <List className="p-0  list-disc list-inside">  
                    <ListItem>
                      <NavLink 
                        to="/admin/pwd-list" 
                        className={({ isActive }) => `ml-2 font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-300"}`}
                      > 
                        <span className="mr-7 text-xl">•</span> Year List
                        <ListItemSuffix>
                          <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                        </ListItemSuffix>
                      </NavLink> 
                    </ListItem>
                  </List>
                </AccordionBody>

                <AccordionBody className="-py-1">
                  <List className="p-0  list-disc list-inside">  
                    <ListItem>
                      <NavLink 
                        to="/admin/yearlist" 
                        className={({ isActive }) => `ml-2 font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-300"}`}
                      > 
                        <span className="mr-7 text-xl">•</span> CDC
                        <ListItemSuffix>
                          <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                        </ListItemSuffix>
                      </NavLink> 
                    </ListItem>
                  </List>
                </AccordionBody>
                {/* <AccordionBody className="-py-1">
                  <List className="p-0  list-disc list-inside">  
                    <ListItem>
                      <NavLink 
                        to="/brgy-sectors/sub-category/personal-info/1" 
                        className={({ isActive }) => `ml-2 font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-300"}`}
                      > 
                        <span className="mr-7 text-xl">•</span> PWD Children
                        <ListItemSuffix>
                          <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                        </ListItemSuffix>
                      </NavLink> 
                    </ListItem>
                  </List>
                </AccordionBody> */}
                
                {/* <AccordionBody className="-py-2">
                  <List className="p-0  list-disc list-inside">  
                    <ListItem>
                      <NavLink 
                        to="/admin/barangay-sectors" 
                        className={({ isActive }) => `ml-2 font-serif flex items-center w-full ${isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-300"}`}
                      > 
                        <span className="mr-7 text-xl">•</span> Barangay Sectors
                        <ListItemSuffix>
                          <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                        </ListItemSuffix>
                      </NavLink> 
                    </ListItem>
                  </List>
                </AccordionBody> */}

              </Accordion>

            {/* <ListItem>
              <NavLink to="/admin" className={({ isActiveProf }) => `font-serif flex items-center w-full dark:text-gray-200 ${isActiveProf ? "text-blue-500" : "text-gray-700"}` } >
                <ListItemPrefix>
                  <Avatar />
                </ListItemPrefix>
                  Profile 
              </NavLink> 
            </ListItem> */}

            <ListItem>
              <NavLink to="/admin/settings" className={({ isActiveSett }) => `font-serif flex items-center w-full dark:text-gray-200 ${isActiveSett ? "text-blue-500" : "text-gray-700"}` } >
                <ListItemPrefix>
                  <Assignment />
                </ListItemPrefix>
                  Settings 
              </NavLink> 
            </ListItem>
          </List>
      </div>
    </>
  );
  const renderStaffSidebar = () => (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="text-lg font-bold">MSWDO</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-white">
            ✖
          </button>
        </div>
        <nav className="p-4">
          <NavLink to="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <DashboardOutlined /> Dashboard
          </NavLink>
          <NavLink to="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <DashboardOutlined /> SQPAL
          </NavLink>
          <button onClick={onLogout} className="flex items-center gap-2 p-2 hover:bg-red-700 rounded mt-4">
            <LogoutIcon /> Logout
          </button>
        </nav>
      </div>
    </>
  );
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-700"> 
 
      <div className="flex-1 flex flex-col"> 
        <header className="fixed w-full p-4 bg-white dark:bg-gray-800 text-gray-800   flex justify-between items-center  border border-gray-100 dark:border-gray-800 shadow-xl ">
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu />
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <a href="/admin/profile" className="   rounded-full  transform scale-100 hover:scale-110 transition-all duration-300">
              <img src={AdminLogo} alt="Logo" className="h-10 w-10 rounded-full  border border-gray-200 dark:border-gray-100  " />
            </a>
            <DarkThemeToggle 
            className="rounded-full  border border-gray-200 transform scale-100 hover:scale-110 transition-all duration-300"
            />
          </div>
        </header>
        {user?.user_type === "admin" 
        ? renderAdminSidebar() 
        : user?.user_type === "payroll" 
          ? renderStaffSidebar() 
          : user?.user_type === "customer" 
            ? renderCustomerSidebar() 
            : null  }
        <main className="lg:ml-[16rem] md:ml-[16rem] mt-20 ">
           <Outlet /> 
         </main>    
      </div>
    </div>
  );
};

export default DefaultLayout;