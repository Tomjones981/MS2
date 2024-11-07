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
const S = () => {
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  return (
    <>
      {" "}
      <div className="min-h-screen flex">
        <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2">
          <img
            src={Logo}
            alt="occ_logo"
            className="w-12 h-12 flex justify-center items-center"
          />
          <div className="text-white flex items-center space-x-2 px-4">
            <span className="text-1xl font-extrabold">
              ATTENDANCE & PAYROLL
            </span>
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
                    href="/faculty"
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
      </div>
      <div
        className={`bg-gray-100 dark:bg-gray-900 mt-20 ml-64 p-4 min-h-screen`}
      >
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default S;
