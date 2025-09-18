import React from 'react';
import { FaUserFriends, FaHome, FaChild, FaUserGraduate, FaWheelchair  } from 'react-icons/fa';
import Graph from './CHILDREN/CICL/Graph';
import Financial_Report from './Endorsement/Financial_Report';
import Hospital_Report from './Endorsement/Hospital_Report';

const AdminDashboard = () => {
  return (
    
    <div className="p-5"> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6"> 
        <div className="bg-white p-5 rounded-md -lg flex items-center justify-between hover:-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-light">Financial Assistance</h2>
            <p className="font-light text-gray-600 dark:text-gray-400 ">Manage Financial Assist. data</p>
          </div>
          <FaUserFriends className="text-blue-500 dark:text-blue-400" size={40} />
        </div>
 
        <div className="bg-white p-5 rounded-md -lg flex items-center justify-between hover:-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-light">Barangay</h2>
            <p className="font-light text-gray-600 dark:text-gray-400">Monitor barangay activities</p>
          </div>
          <p className='font-light font-extrabold text-blue-500 dark:text-blue-400 text-2xl'>14</p>
          <FaHome className="text-green-500 dark:text-green-400" size={40} />
        </div>
 
        <div className="bg-white p-5 rounded-md -lg flex items-center justify-between hover:-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-light">Children</h2>
            <p className="font-light text-gray-600 dark:text-gray-400">Track children's records</p>
          </div>
          <FaChild className="text-yellow-500 dark:text-yellow-400" size={40} />
        </div>
        
        <div className="bg-white p-5 rounded-md -lg flex items-center justify-between hover:-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-light">Youth</h2>
            <p className="font-light text-gray-600 dark:text-gray-400">Track youth's records</p>
          </div>
          <FaUserGraduate  className="text-indigo-500 dark:text-indigo-400" size={40} />
        </div>

        <div className="bg-white p-5 rounded-md -lg flex items-center justify-between hover:-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-500">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-light">PWD</h2>
            <p className="font-light text-gray-600 dark:text-gray-400">Track pwd's records</p>
          </div>
          <FaWheelchair  className="text-purple-500 dark:text-purple-400" size={40} />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-5 mt-5">
        <div className="col-span-1 sm:col-span-1 lg:col-span-4">
          <Financial_Report />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-4">
          <Hospital_Report />
        </div>
      </div> */}
      <div className='grid grid-cols-2  2xl:grid-cols-2 lg:grid-cols-1 mt-5 gap-5'>
        <div className=''>
          <Financial_Report />
        </div>
        <div className=''>
          <Hospital_Report />
        </div>
      </div>

      <div className=''>
        < Graph />
      </div>
       
    </div>
  );
};

export default AdminDashboard;
