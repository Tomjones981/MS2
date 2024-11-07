import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Logo from "../../../assets/images/OCC_LOGO.png";

import { DarkThemeToggle } from "flowbite-react";
import { FaUsers } from "react-icons/fa";
import {
  HiOutlineMenuAlt2,
  HiChartPie,
  HiClipboardList,
  HiCalendar,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import { RiFileHistoryFill } from "react-icons/ri";
import { IoDocumentText } from "react-icons/io5";

const Ooo = () => {
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2">
        <img
          src={Logo}
          alt="occ_logo"
          className="w-12 h-12 flex justify-center items-center"
        />
        <div className="text-white flex items-center space-x-2 px-4">
          <span className="text-1xl font-extrabold">ATTENDANCE & PAYROLL</span>
        </div>
        <nav>
          <a
            href="/dash"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            <HiChartPie className="mr-3" /> Dashboard
          </a>
          <div className="space-y-1">
            <a
              href="#"
              onClick={() => setIsFacultyOpen(!isFacultyOpen)}
              className="flex items-center justify-between py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              <div className="flex items-center">
                <FaUsers className="mr-3" /> Faculty
              </div>
              {isFacultyOpen ? (
                <HiChevronUp className="ml-auto" />
              ) : (
                <HiChevronDown className="ml-auto" />
              )}
            </a>
            {isFacultyOpen && (
              <div className="pl-8">
                <a
                  href="/faculty/list"
                  className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                  Faculty List
                </a>
                <a
                  href="/faculty/schedule"
                  className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                  Schedule
                </a>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <a
              href="#"
              onClick={() => setIsAttendanceOpen(!isAttendanceOpen)}
              className="flex items-center justify-between py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              <div className="flex items-center">
                <HiClipboardList className="mr-3" /> Attendance
              </div>
              {isAttendanceOpen ? (
                <HiChevronUp className="ml-auto" />
              ) : (
                <HiChevronDown className="ml-auto" />
              )}
            </a>
            {isAttendanceOpen && (
              <div className="pl-8">
                <a
                  href="/attendance/calendar"
                  className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                  Calendar
                </a>
              </div>
            )}
          </div>
          <a
            href="/credential-request"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            <IoDocumentText className="mr-3" /> Credential Request
          </a>
          <a
            href="/history"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            <RiFileHistoryFill className="mr-3" /> History
          </a>
        </nav>
      </div>

      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-4 flex items-center justify-between w-full fixed  ">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="z-20 flex p-1 hover:bg-gray-100 rounded-md dark:text-white dark:hover:bg-gray-700"
          >
            <HiOutlineMenuAlt2 className="text-3xl text-gray-600 dark:text-white" />
          </button>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Type to search..."
              className="border rounded-lg py-2 px-4"
            />
            <div className="relative">
              <button className="relative block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none">
                <img
                  className="h-full w-full object-cover"
                  src="https://via.placeholder.com/150"
                  alt="User avatar"
                />
              </button>
            </div>
          </div>
          <DarkThemeToggle className="z-20" />
        </header>
 
      </div>
    </div>
  );
};

export default Ooo;
