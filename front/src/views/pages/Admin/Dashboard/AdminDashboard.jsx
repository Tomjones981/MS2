import React, { useEffect, useState } from 'react';
import { BsPeopleFill, BsPersonCheckFill, BsPersonXFill } from 'react-icons/bs';
import { FaUsers  } from "react-icons/fa";
import { FaUserGraduate } from 'react-icons/fa';
import { RiUserStarFill } from 'react-icons/ri'; 
import { FaUserAltSlash } from 'react-icons/fa';
import { FaUserCog } from 'react-icons/fa';

import { FaUserTie } from 'react-icons/fa';
import axiosClient from '../../../../api/axiosClient';
import { BeatLoader } from 'react-spinners';

export const AdminDashboard = () => {
  const [totalFaculties, setTotalFaculties] = useState(0);
  const [totalFacultiesFullTime, setTotalFacultiesFullTime] = useState(0);
  const [totalFacultiesPartTime, setTotalFacultiesPartTime] = useState(0);
  const [totalFacultiesPartTimeRegular, setTotalFacultiesPartTimeRegular] = useState(0);
  const [totalFacultiesActive, setTotalFacultiesActive] = useState(0);
  const [totalFacultiesInActive, setTotalFacultiesInActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalFaculties = async () => {
      try {
        const response = await axiosClient.get('/get_total/faculties');
        setTotalFaculties(response.data.total_faculties);
      } catch (error) {
        console.error('Error fetching total faculties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalFaculties();
  }, []);

  useEffect(() => {
    const fetchTotalFacultiesFullTime = async () => {
      try {
        const response = await axiosClient.get('/get_total/faculties/full_time');
        setTotalFacultiesFullTime(response.data.total_full_time_faculties);
      } catch (error) {
        console.error('Error fetching total faculties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalFacultiesFullTime();
  }, []);

  useEffect(() => {
    const fetchTotalFacultiesPartTime = async () => {
      try {
        const response = await axiosClient.get('/get_total/faculties/part_time');
        setTotalFacultiesPartTime(response.data.total_part_time_faculties);
      } catch (error) {
        console.error('Error fetching total faculties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalFacultiesPartTime();
  }, []);

  useEffect(() => {
    const fetchTotalFacultiesPartTimeRegular = async () => {
      try {
        const response = await axiosClient.get('/get_total/faculties/part_time_regular');
        setTotalFacultiesPartTimeRegular(response.data.total_part_time_regular_faculties);
      } catch (error) {
        console.error('Error fetching total faculties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalFacultiesPartTimeRegular();
  }, []);

  useEffect(() => {
    const fetchTotalFacultiesActive = async () => {
      try {
        const response = await axiosClient.get('/get_total/faculties/active');
        setTotalFacultiesActive(response.data.total_active_faculties);
      } catch (error) {
        console.error('Error fetching total faculties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalFacultiesActive();
  }, []);

  useEffect(() => {
    const fetchTotalFacultiesInActive = async () => {
      try {
        const response = await axiosClient.get('/get_total/faculties/inactive');
        setTotalFacultiesInActive(response.data.total_inactive_faculties);
      } catch (error) {
        console.error('Error fetching total faculties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalFacultiesInActive();
  }, []);

  return (
    <>
      <h1 className="mb-5 font-semibold text-xl dark:text-white">Dashboard</h1>  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5"> 
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">FACULTY</h2>
            {loading ? (
              <p><BeatLoader /></p>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{totalFaculties}</p>
            )}
            <p className="text-sm text-green-500 mt-2">
              Total Faculties in OCC
            </p>
          </div>
          <div className="text-blue-500">
            <FaUsers className="h-12 w-12" />
          </div>
        </div>
 
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">FULL TIME</h2>
            {loading ? (
              <p><BeatLoader /></p>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{totalFacultiesFullTime}</p>
            )}
            <p className="text-sm text-green-500 mt-2">
              Total Full Time Faculties in OCC
            </p>
          </div>
          <div className="text-green-500">
            <FaUserGraduate className="h-12 w-12" />
          </div>
        </div>
 
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">PART TIME</h2>
            {loading ? (
              <p><BeatLoader /></p>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{totalFacultiesPartTime}</p>
            )}
            <p className="text-sm text-green-500 mt-2">
              Total Part Time Faculties in OCC
            </p>
          </div>
          <div className="text-purple-500">
            <RiUserStarFill className="h-12 w-12" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">PT-REGULAR</h2>
            {loading ? (
              <p><BeatLoader /></p>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{totalFacultiesPartTimeRegular}</p>
            )}
            <p className="text-sm text-green-500 mt-2">
              Total Part Time Regular Faculties in OCC
            </p>
          </div>
          <div className="text-yellow-500">
            <FaUserTie className="h-12 w-12" />
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-5"> 
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">ACTIVE</h2>
            {loading ? (
              <p><BeatLoader /></p>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{totalFacultiesActive}</p>
            )}
            <p className="text-sm text-green-500 mt-2">
              Total Active Faculties in OCC
            </p>
          </div>
          <div className="text-teal-500">
            <BsPersonCheckFill className="h-12 w-12" />
          </div>
        </div>
 
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">IN-ACTIVE</h2>
            {loading ? (
              <p><BeatLoader /></p>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{totalFacultiesInActive}</p>
            )}
            <p className="text-sm text-green-500 mt-2">
              Total Inactive Faculties in OCC
            </p>
          </div>
          <div className="text-red-500">
            <BsPersonXFill className="h-12 w-12" />
          </div>
        </div>
      </div>

      

      
    </>
  );
};
