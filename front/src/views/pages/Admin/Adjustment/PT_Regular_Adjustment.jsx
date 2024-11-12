 
import React, { useState } from 'react';
import { DatePicker, Typography, Space, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../../api/axiosClient';
import { FaUserTie, FaUserClock, FaUserCheck, FaUserPlus, FaUserFriends } from 'react-icons/fa'; // Import icons
import { FaPlus } from 'react-icons/fa'; 
import { Modal } from 'flowbite-react';

const { RangePicker } = DatePicker;

const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };
const PT_Regular_Adjustment = () => {
    const [adjustmentAmount, setAdjustmentAmount] = useState(null);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [payrollData, setPayrollData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdjustmentChange = (e) => {
      setAdjustmentAmount(e.target.value);
    };

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
          const response = await axiosClient.get('/get-payroll-adjustment/part/time/regular', {
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

      const handleSaveAdjustment = async () => {
        setLoading(true);
     
        if (!adjustmentAmount || isNaN(adjustmentAmount)) {
            message.error("Please enter a valid adjustment amount.");
            setLoading(false);
            return;
        }
    
        try { 
            const payrollId = selectedPayroll.id;  
    
            const response = await axiosClient.post('/update-payroll-adjustment', {
                payroll_id: payrollId,   
                adjustment: adjustmentAmount
            });
    
            message.success("Adjustment updated successfully!");
            setLoading(false);
            setOpenModal(false); 
            fetchPayrollHistory();  
        } catch (error) {
            message.error("Error updating adjustment. Please try again.");
            console.error(error);
            setLoading(false);
        }
      };

      const handleEditClick = (payroll) => {
        setSelectedPayroll(payroll);
        setAdjustmentAmount(payroll.adjustment ?? 0);  
        setOpenModal(true);
      };

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      };

      const filteredPayrollData = payrollData.filter(payroll =>
        payroll.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      function formatDateRange(dateFrom, dateTo) {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
      
        const sameMonth = from.getMonth() === to.getMonth();
        const month = from.toLocaleString('default', { month: 'long' });
        const year = from.getFullYear();
      
        if (sameMonth) {
          return `${month} ${from.getDate()}-${to.getDate()}, ${year}`;
        } else { 
          const monthTo = to.toLocaleString('default', { month: 'long' });
          return `${month} ${from.getDate()} - ${monthTo} ${to.getDate()}, ${year}`;
        }
      }
    
 
    const buttons = [
        { label: 'Full Time', route: '/admin/adjustment/full/time', icon: <FaUserTie />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'Part Time', route: '/admin/adjustment/part/time', icon: <FaUserClock />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'Extra Load', route: '/extra_load', icon: <FaUserCheck />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'PT-Regular', route: '/admin/adjustment/parttime/regular', icon: <FaUserPlus />, color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
        { label: 'Program Heads', route: '/admin/adjustment/program/heads', icon: <FaUserFriends />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
    ];

  return (
    <div className="mt-2 col-span-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="bg-gray-800 p-6 m-1 rounded-lg shadow-md">
        <div className="flex flex-col items-start mb-5">
          <div className="flex w-full justify-between items-center">
            <h1 className="font-bold text-2xl text-white uppercase tracking-wide">Payroll Adjustment</h1>
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
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Adjustment</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Adjusted Net Pay</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Action</th> 
                  </tr>
                </thead>
                <tbody> 
                    {filteredPayrollData.map((payroll, index) => (
                      <tr key={`${payroll.faculty_id}-${index}`}  className="bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-slate-200">
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center"> {formatDateRange(payroll.date_from, payroll.date_to)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{payroll.full_name}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(payroll.monthly_rate)}</td> 
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600"> {parseFloat(payroll.hours_or_days).toFixed(2)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(payroll.gross_amount)}</td> 
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">{payroll.late}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{payroll.tax}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(payroll.netpay)}</td> 
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">₱{formatNumber(payroll.adjustment ?? 0  )}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">₱{formatNumber(payroll.adjusted_netpay ?? 0)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">
                          <button onClick={() => handleEditClick(payroll)}  className="flex items-center justify-center w-10 h-10 bg-gray-600 border border-gray-200 rounded-full shadow-md hover:bg-gray-500 hover:border-gray-500 transition-all duration-200">
                            <FaPlus className="text-gray-100 hover:text-white" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
      )} 
          </div> 
        </div>

        <Modal show={openModal} size="xl" onClose={() => setOpenModal(false)} popup>
          <Modal.Header className="p-5 border-b border-gray-300 dark:border-gray-600 pb-2">
            <h1 className="uppercase font-semibold text-xl dark:text-white">Add Adjustment</h1>
          </Modal.Header> 
          <Modal.Body>
            <div className="border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-md dark:shadow-xl p-6">
              {/* <h1 className="mb-5 font-semibold text-md dark:text-white uppercase underline">Teaching Units</h1> */}
              <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5'>
                <div>
                  <label htmlFor="subjects" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adjustment Amount</label>
                  <input type="number" id="subjects" value={adjustmentAmount} onChange={handleAdjustmentChange}   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" required/>
                </div> 
                <div className="flex justify-end ">
                  <button onClick={handleSaveAdjustment} type="submit" className={`text-white bg-gradient-to-br from-gray-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}> {loading ? 'Saving...' : 'Save'} </button>
                </div>
              </div> 
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default PT_Regular_Adjustment;
