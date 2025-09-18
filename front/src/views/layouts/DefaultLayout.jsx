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
import {  HiChartPie  } from "react-icons/hi"; 
import { useStateContext } from "../../context/ContextProvider";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Menu, Logout as LogoutIcon, PieChartOutlined, Assignment, ExpandLess, ExpandMore, ShoppingBagOutlined, DashboardOutlined, GroupOutlined, ChevronRight, VerifiedUserRounded } from "@mui/icons-material";
import { Avatar, DarkThemeToggle, Flowbite, } from "flowbite-react"; import LoadingScreen from "../components/LoadingScreen";
import { FaUsers, FaRegCalendarCheck, FaChalkboardTeacher, FaHandHoldingUsd, FaProjectDiagram } from "react-icons/fa";
import { Card, Typography, List, ListItem, ListItemPrefix, ListItemSuffix, Chip, Accordion, AccordionHeader, AccordionBody, Alert } from "@material-tailwind/react";
import {  FileText, Accessibility, AccessibilityIcon} from "lucide-react";
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { NotebookPen } from "lucide-react";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
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
      {/* <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-gray-800 transform transition-transform dark:bg-gray-800 dark:text-gray-200 -xl border border-gray-100 rounded-xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800`}> */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-gray-800 transform transition-transform dark:bg-gray-800 dark:text-gray-200 -xl border border-gray-100 dark:border-gray-800 ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 flex flex-col`} >
        <div className="p-4 flex items-center  justify-between">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-normal  ">MSWDO</span>
            <img src={Logo2} alt="Logo2" className="h-10 w-10 rounded-full" />
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-800 dark:text-gray-200">
            ✖
          </button>
        </div> 

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {/* <List className="overflow-y-auto max-h-[550px]"> */}
            <List className="">
              <hr className="my-2 border-blue-gray-50 mt-[-9px] -lg " />
              <Typography className="ml-1 text-xs uppercase text-gray-400">Menu</Typography> 
              <Accordion open={open === 5} icon={ <ExpandMore className={`mx-auto h-4 w-2  transition-transform -rotate-90 ${ open === 5 ? "rotate-0" : "" }`} /> } >
                  <ListItem className="p-0 hover:bg-blue-100" selected={open === 5}>
                    <AccordionHeader onClick={() => handleOpen(5)} className="border-b-0 p-3">
                      <ListItemPrefix>
                        <div className="text-2xl text-gray-400">
                          <HiChartPie className="-mr-1"/>
                        </div>
                      </ListItemPrefix>
                      <Typography color="blue-gray" className="font-light ml-[-3rem] text-sm  text-gray-400 hover:text-blue-400 dark:text-gray-300  ">
                        Dashboard
                      </Typography>
                      {/* <h1 color="blue-gray" className="font-light ml-[-3rem] text-sm  text-gray-400 dark:text-gray-300  ">Dashboard</h1> */}
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="-py-1">
                    <List className="p-0 list-disc list-inside">
                      <ListItem className="p-0">
                        <NavLink
                          to="/admin/dashboard"
                          className={({ isActive }) =>
                            `font-light ml-2 text-sm flex items-center w-full p-3 rounded-md transition ${
                              isActive
                                ? "text-white bg-blue-100 dark:bg-blue-200"
                                : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                            }`
                          }
                        >
                          <p className="text-gray-400 mr-7">•</p>
                          <p className="text-gray-400">Overall</p>
                          <ListItemSuffix>
                            <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                          </ListItemSuffix>
                        </NavLink>
                      </ListItem>
                    </List>
                  </AccordionBody>
                  <AccordionBody className="-py-1">
                    <List className="p-0 list-disc list-inside">
                      <ListItem className="p-0">
                        <NavLink
                          to="/admin/report/pwd"
                          className={({ isActive }) =>
                            `font-light ml-2 text-sm flex items-center w-full p-3 rounded-md transition ${
                              isActive
                                ? "text-white bg-blue-100 dark:bg-blue-200"
                                : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                            }`
                          }
                        >
                          <p className="text-gray-400 mr-7">•</p>
                          <p className="text-gray-400">PWD Report</p>
                          <ListItemSuffix>
                            <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                          </ListItemSuffix>
                        </NavLink>
                      </ListItem>
                    </List>
                  </AccordionBody>
                  <AccordionBody className="-py-1">
                    <List className="p-0 list-disc list-inside">
                      <ListItem className="p-0">
                        <NavLink
                          to="/admin/cicl/report"
                          className={({ isActive }) =>
                            `font-light ml-2 text-sm flex items-center w-full p-3 rounded-md transition ${
                              isActive
                                ? "text-white bg-blue-100 dark:bg-blue-200"
                                : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                            }`
                          }
                        >
                          <p className="text-gray-400 mr-7">•</p>
                          <p className="text-gray-400">CICL Report</p>
                          <ListItemSuffix>
                            <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                          </ListItemSuffix>
                        </NavLink>
                      </ListItem>
                    </List>
                  </AccordionBody> 
              </Accordion>
  

              <Accordion open={open === 7} icon={ <ExpandMore className={`mx-auto h-4 w-4 transition-transform -rotate-90 ${ open === 7 ? "rotate-0" : "" }`} /> } >
                  <ListItem className="p-0 hover:bg-blue-100" selected={open === 7}>
                    <AccordionHeader onClick={() => handleOpen(7)} className="border-b-0 p-3">
                      <ListItemPrefix>
                        <div className="text-2xl text-gray-400">
                          <NotebookPen className="-mr-1"/>
                        </div>
                      </ListItemPrefix>
                      <Typography color="blue-gray" className="font-light ml-[-4rem] text-sm  text-gray-400 dark:text-gray-300  ">
                        Log Book
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="-py-1">
                    <List className="p-0 list-disc list-inside">
                      <ListItem className="p-0">
                        <NavLink
                          to="/admin/records"
                          className={({ isActive }) =>
                            `font-light ml-2 text-sm flex items-center w-full p-3 rounded-md transition ${
                              isActive
                                ? "text-white bg-blue-100 dark:bg-blue-200"
                                : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                            }`
                          }
                        >
                          <p className="text-gray-400 mr-7">•</p>
                          <p className="text-gray-400">Financial Assistance</p>
                          <ListItemSuffix>
                            <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                          </ListItemSuffix>
                        </NavLink>
                      </ListItem>
                    </List>
                  </AccordionBody>
                  <AccordionBody className="-py-1">
                    <List className="p-0 list-disc list-inside">
                      <ListItem className="p-0">
                        <NavLink
                          to="/admin/hospital_bill_info"
                          className={({ isActive }) =>
                            `font-light ml-2 text-sm flex items-center w-full p-3 rounded-md transition ${
                              isActive
                                ? "text-white bg-blue-100 dark:bg-blue-200"
                                : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                            }`
                          }
                        >
                          <p className="text-gray-400 mr-7">•</p>
                          <p className="text-gray-400">Hospitall Bill Info</p>
                          <ListItemSuffix>
                            <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                          </ListItemSuffix>
                        </NavLink>
                      </ListItem>
                    </List>
                  </AccordionBody> 
              </Accordion>

              <Accordion open={open === 6} icon={ <ExpandMore className={`mx-auto h-4 w-4 transition-transform -rotate-90 ${ open === 6 ? "rotate-0" : "" }`} /> } >
                  <ListItem className="p-0 hover:bg-blue-100" selected={open === 6}>
                    <AccordionHeader onClick={() => handleOpen(6)} className="border-b-0 p-3">
                      <ListItemPrefix>
                        <div className="text-2xl text-gray-400">
                          <FolderCopyRoundedIcon className="-mr-1"/>
                        </div>
                      </ListItemPrefix>
                      <Typography color="blue-gray" className=" font-light ml-[-4rem] text-sm  text-gray-400 dark:text-gray-300  ">
                        Records
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="-py-1">
                    <List className="p-0 list-disc list-inside">
                      <ListItem className="p-0">
                        <NavLink
                          to="/admin/pwd-list"
                          className={({ isActive }) =>
                            `font-light ml-2 text-sm flex items-center w-full p-3 rounded-md transition ${
                              isActive
                                ? "text-white bg-blue-100 dark:bg-blue-200"
                                : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                            }`
                          }
                        >
                          <p className="text-gray-400 mr-7">•</p>
                          <p className="text-gray-400">Year List</p>
                          <ListItemSuffix>
                            <Chip size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                          </ListItemSuffix>
                        </NavLink>
                      </ListItem>
                    </List>
                  </AccordionBody> 
              </Accordion>
  
              <Typography className="ml-1 text-xs uppercase text-gray-400">Pages</Typography>
              
              <ListItem>
                <NavLink to="/admin/notes" className={({ isActive }) => `font-light -ml-2  text-sm flex items-center w-full p-3 rounded-md transition ${ isActive ? "text-gray-500 bg-blue-100 dark:bg-blue-200" : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800" }` } >
                  <ListItemPrefix>
                    <div className="text-2xl text-gray-400">
                      <FileText className="mr-1"/>
                    </div>
                    
                  </ListItemPrefix>
                    Notes
                  <ListItemSuffix>
                    <Chip 
                    // value="14"
                    size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                  </ListItemSuffix>
                </NavLink> 
              </ListItem> 
            </List>
          </div>
          <div className="p-2 border-t border-gray-200 hover:bg-gray-200 dark:border-gray-700">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full p-2  rounded text-left text-gray-700 dark:text-gray-200"
            >
              <LogoutIcon /> 
                <Typography color="blue-gray" className="font-light  text-sm  text-gray-400 hover:text-blue-400 dark:text-gray-300  ">
                  Logout
                </Typography>
               
            </button>
          </div>
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
        <header className="fixed w-full p-4 bg-white dark:bg-gray-800 text-gray-800   flex justify-between items-center  border border-gray-100 dark:border-gray-800 -xl ">
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu />
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div>
                <a href="" className="text-gray-600 dark:text-gray-200">
                  < NotificationsActiveOutlinedIcon className="w-6 h-6" />
                </a>
            </div>
            <DarkThemeToggle 
            className="  transform scale-100 hover:scale-110 transition-all duration-300"
            />
            <div>
              <a href="" className="text-gray-600 dark:text-gray-200">
                <SettingsRoundedIcon className="w-6 h-6"/>
              </a>
            </div>
            <a href="/admin/profile" className="   rounded-full  transform scale-100 hover:scale-110 transition-all duration-300">
              <img src={AdminLogo} alt="Logo" className="h-10 w-10 rounded-full  border border-gray-200 dark:border-gray-100  " />
            </a>
          </div>
        </header>
        {user?.user_type === "admin" 
        ? renderAdminSidebar() 
        : user?.user_type === "payroll" 
          ? renderStaffSidebar() 
          : user?.user_type === "customer" 
            ? renderCustomerSidebar() 
            : null  }
        <main className="lg:ml-[16rem] md:ml-[16rem] mt-20  bg-gray-50 dark:bg-gray-700 ">
           <Outlet /> 
         </main>    
      </div>
    </div>
  );
};

export default DefaultLayout;