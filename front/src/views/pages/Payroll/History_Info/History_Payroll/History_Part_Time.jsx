 
import React, { useState } from 'react';
import { DatePicker, Typography, Space, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../../../api/axiosClient';
import { FaUserTie, FaUserClock, FaUserCheck, FaUserPlus, FaUserFriends } from 'react-icons/fa';  


const { RangePicker } = DatePicker;
const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };
const History_Part_Time = () => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [payrollData, setPayrollData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDateChange = (dates) => {
        setDateRange(dates);
      };

     
      const fetchPayrollHistory = async (e) => {
        e.preventDefault();
        setError('');
     
        const dateFrom = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
        const dateTo = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
    
        console.log("Fetching payroll history from:", dateFrom, "to:", dateTo);
    
        if (!dateFrom || !dateTo) {
          setError('Please select a valid date range.');
          return;
        }
    
        try {
          const response = await axiosClient.get('/get-payroll-history/part/time', {
            params: {
              date_from: dateFrom,
              date_to: dateTo,
            },
          });
          console.log("Payroll data received:", response.data);  
          setPayrollData(response.data);
        } catch (err) {
          setError('Error fetching payroll data. Please try again.');
          console.error("Error fetching payroll data:", err);  
        }
      };

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      };

      const filteredPayrollData = payrollData.filter(payroll =>
        payroll.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
 
    const buttons = [
        { label: 'Full Time', route: '/payroll/history/full/time', icon: <FaUserTie />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'Part Time', route: '/payroll/history/part/time', icon: <FaUserClock />, color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
        { label: 'Extra Load', route: '/extra_load', icon: <FaUserCheck />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'PT-Regular', route: '/payroll/history/parttime/regular', icon: <FaUserPlus />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'Program Heads', route: '/payroll/history/program/heads', icon: <FaUserFriends />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
    ];

  return (
    <div className="mt-2 col-span-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="bg-gray-800 p-6 m-1 rounded-lg shadow-md">
        <div className="flex flex-col items-start mb-5">
          <div className="flex w-full justify-between items-center">
            <h1 className="font-bold text-2xl text-white uppercase tracking-wide">Payroll History</h1>
          </div>
          <hr className="my-3 border-t border-gray-500 dark:border-gray-600 w-full" />
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {buttons.map(({ label, route, color, icon }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              type="button"
              className={`flex items-center justify-center py-2 px-4   rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 ${color}`}
            >
                <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-10'>
        <form onSubmit={fetchPayrollHistory}> 
          <div className="grid grid-cols-10 mt-2 mb-2 gap-4"> 
            <div className="col-span-7">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Date Range</label>
              <Space direction="vertical" size={12} className='text-gray-700 dark:text-gray-200'>
                <RangePicker onChange={handleDateChange}className='h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' />
              </Space>
              <button type="submit"   className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate</button>
            </div>
            <div className="relative col-span-3 flex items-end">
              <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
            </div>
          </div>
        </form>
        <div className="relative overflow-x-auto">
          <div className="max-h-[22rem] overflow-y-auto mb-4"> 
            {error && <p className="text-red-500">{error}</p>}
            {filteredPayrollData.length > 0 && (
              <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
                <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Date Range</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Faculty Name</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Monthly</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Worked Hours</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Gross</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Late</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Withholding Tax</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Net Pay</th> 
                  </tr>
                </thead>
                <tbody> 
                    {filteredPayrollData.map((payroll, index) => (
                      <tr key={`${payroll.faculty_id}-${index}`}  className="bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-slate-200">
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{formatDate(payroll.date_from)} - {formatDate(payroll.date_to)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{payroll.full_name}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(payroll.monthly_rate)}</td> 
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">{payroll.hours_or_days}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(payroll.gross_amount)}</td>
                         
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">{payroll.late}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{payroll.tax}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(payroll.netpay)}</td>
                     
                      </tr>
                    ))}
                </tbody>
              </table>
      )} 
          </div> 
        </div>
      </div>
    </div>
  );
};

export default History_Part_Time;
