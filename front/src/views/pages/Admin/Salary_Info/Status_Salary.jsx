import React, { useState } from 'react';
import axiosClient from '../../../../api/axiosClient';
import { DatePicker, message } from 'antd';
import 'dayjs/locale/en';
import { BeatLoader } from 'react-spinners';
// import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10; // Number of items per page

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Status_Salary = () => {
  const [selectedPayrolls, setSelectedPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [pendingPage, setPendingPage] = useState(1);
  const [releasedPage, setReleasedPage] = useState(1);

  const handleMonthChange = async (date, dateString) => {
    setSelectedMonth(date);
    setData(null);
    setSelectedPayrolls([]);
    setLoading(true);

    try {
      const response = await axiosClient.post('/getDateRange', { month: dateString });
      const dateRanges = response.data;
      if (dateRanges.length > 0) {
        fetchData(dateRanges[0].date_from, dateRanges[0].date_to);
      }
    } catch (error) {
      console.error('Error fetching date ranges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (dateFrom, dateTo) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/get-payroll-salary-status', {
        date_from: dateFrom,
        date_to: dateTo,
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayrollData = data
    ? data.filter((payroll) =>
        payroll.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const pendingPayrollData = filteredPayrollData.filter(
    (payroll) => payroll.salary_status === 'pending'
  );

  const releasedPayrollData = filteredPayrollData.filter(
    (payroll) => payroll.salary_status === 'released'
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = pendingPayrollData.map((payroll) => payroll.id);
      setSelectedPayrolls(allIds);
    } else {
      setSelectedPayrolls([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedPayrolls((prev) =>
      prev.includes(id)
        ? prev.filter((payrollId) => payrollId !== id)
        : [...prev, id]
    );
  };

  const updateStatusToReleased = async () => {
    if (selectedPayrolls.length === 0) {
      alert('No payrolls selected.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/update-payroll-status', {
        payrollIds: selectedPayrolls,
        status: 'released',
      });
      message.success('Status updated successfully.');
      setSelectedPayrolls([]);
      if (selectedMonth) {
        handleMonthChange(selectedMonth, selectedMonth.format('YYYY-MM'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatDateRange = (dateFrom, dateTo) => {
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
  };

  const renderTable = (payrollData, isPending, currentPage, setPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = payrollData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(payrollData.length / ITEMS_PER_PAGE);

    return (
      <div className="relative overflow-x-auto">
        <div className="max-h-[22rem] overflow-y-auto mb-4">
          <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200 dark:border-slate-600">
            <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200">
              <tr>
                {isPending && (
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleSelectAll}
                      checked={
                        selectedPayrolls.length === pendingPayrollData.length &&
                        pendingPayrollData.length > 0
                      }
                    />
                  </th>
                )}
                <th className="px-6 py-3 border text-center dark:border-gray-600">Date Range</th>
                <th className="px-6 py-3 border text-center dark:border-gray-600">Faculty Name</th>
                <th className="px-6 py-3 border text-center dark:border-gray-600">Adjustment</th>
                <th className="px-6 py-3 border text-center dark:border-gray-600">Net Pay</th>
                <th className="px-6 py-3 border text-center dark:border-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <BeatLoader size={12} />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((payroll, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {isPending && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedPayrolls.includes(payroll.id)}
                          onChange={() => handleCheckboxChange(payroll.id)}
                        />
                      </td>
                    )}
                    <td className="px-6 py-3 text-center">
                      {formatDateRange(payroll.date_from, payroll.date_to)}
                    </td>
                    <td className="px-6 py-3 text-center">{payroll.full_name}</td>
                    <td className="px-6 py-3 text-center">
                      ₱{formatNumber(payroll.adjustment ?? 0)}
                    </td>
                    <td className="px-6 py-3 text-center">₱{formatNumber(payroll.netpay)}</td>
                    {/* <td className="px-6 py-3 text-center">
                      {payroll.salary_status === 'released' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 inline" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-yellow-500 inline" />
                      )}
                      {payroll.salary_status}
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="mt-2 col-span-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-300">
     <div className='  items-start mb-5'>
      <div className='flex justify-between'>
          <h1 className='font-bold text-2xl text-gray-600 uppercase tracking-wide dark:text-gray-200'>Salary Status Info</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={updateStatusToReleased} disabled={loading} > 
            {/* {loading ? 'Updating...' : 'Mark as Released'}  */}
            {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                  </svg>
                ) : (
                  <> 
                    Mark as Released  
                  </>
                )}
          </button>
      </div>
      <hr className=" border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} />
     </div>
     {/* <div className="flex justify-end items-center gap-5 mb-2">
        <h1 className="flex items-center dark:text-gray-400">
          <ClockIcon className="h-5 w-5 text-yellow-500 mr-1 " />
          Pending
        </h1>
        <h1 className="flex items-center dark:text-gray-400">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
          Released
        </h1>
      </div> */}
     <div className="grid grid-cols-10 mb-2 gap-4">
        <div className="col-span-7">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"> Select Month </label>
          <DatePicker value={selectedMonth} onChange={handleMonthChange} picker="month" className="h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" />
        </div>
        <div className="relative col-span-3 flex items-end">
          <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-7">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>  
          </div>
          <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
        </div>
      </div> 

      
      {/* <div className="grid grid-cols-2 gap-4">
        {renderTable(pendingPayrollData, true)}
        {renderTable(releasedPayrollData, false)}
      </div> */} 
      <div className="mt-4">
        <h2 className="text-gray-800 dark:text-gray-100 mb-2">Pending Payroll</h2>
        {renderTable(pendingPayrollData, true, pendingPage, setPendingPage)}
      </div>
      <div className="mt-8">
        <h2 className="text-gray-800 dark:text-gray-100 mb-2">Released Payroll</h2>
        {renderTable(releasedPayrollData, false, releasedPage, setReleasedPage)}
      </div> 
    </div>
  );
};

export default Status_Salary;
