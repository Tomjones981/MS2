import React from 'react';
import { FaUserFriends, FaHome, FaChild } from 'react-icons/fa';
import PWD_BarGraph from './Graphs/PWD_BarGraph'; 
const AdminDashboard = () => {
  return (
    
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5 text-center dark:text-gray-200 font-serif">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Senior Citizens Card */}
        <div className="bg-white p-5 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-serif">Senior Citizens</h2>
            <p className="font-serif text-gray-600 dark:text-gray-400 ">Manage senior citizens' data</p>
          </div>
          <FaUserFriends className="text-blue-500 dark:text-blue-400" size={40} />
        </div>

        {/* Barangay Card */}
        <div className="bg-white p-5 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-serif">Barangay</h2>
            <p className="font-serif text-gray-600 dark:text-gray-400">Monitor barangay activities</p>
          </div>
          <p className='font-serif font-extrabold text-blue-500 dark:text-blue-400 text-2xl'>14</p>
          <FaHome className="text-green-500 dark:text-green-400" size={40} />
        </div>

        {/* Minors Card */}
        <div className="bg-white p-5 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-serif">Children</h2>
            <p className="font-serif text-gray-600 dark:text-gray-400">Track children's records</p>
          </div>
          <FaChild className="text-yellow-500 dark:text-yellow-400" size={40} />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-1   gap-6'>
        <div>
            <PWD_BarGraph />
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
