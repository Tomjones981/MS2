import React, { useState } from 'react';
import { DatePicker, Space, Button, message } from 'antd';
import axiosClient from '../../../../../api/axiosClient';

const { RangePicker } = DatePicker;

const Gagu = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [payrollData, setPayrollData] = useState([]);
  const [error, setError] = useState('');

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const fetchPayrollHistory = async (e) => {
    e.preventDefault();
    setError('');

    // Extract date_from and date_to from the selected range
    const dateFrom = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
    const dateTo = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';

    console.log("Fetching payroll history from:", dateFrom, "to:", dateTo);

    if (!dateFrom || !dateTo) {
      setError('Please select a valid date range.');
      return;
    }

    try {
      const response = await axiosClient.get('/get-payroll-history', {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payroll History</h1>
      <form onSubmit={fetchPayrollHistory} className="mb-4">
        <div className="flex space-x-4">
          <div className="col-span-7">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Date Range</label>
            <Space direction="vertical" size={12} className='text-gray-700 dark:text-gray-200'>
              <RangePicker
                onChange={handleDateChange}
                className='h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
              />
            </Space>
            <button type="submit" >Generate</button>
          </div>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {payrollData.length > 0 && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Faculty ID</th>
              <th className="border border-gray-300 p-2">First Name</th>
              <th className="border border-gray-300 p-2">Last Name</th>
              <th className="border border-gray-300 p-2">Rate Type</th>
              <th className="border border-gray-300 p-2">Rate Value</th>
              <th className="border border-gray-300 p-2">Date From</th>
              <th className="border border-gray-300 p-2">Date To</th>
              <th className="border border-gray-300 p-2">Hours/Days</th>
              <th className="border border-gray-300 p-2">Gross Amount</th>
              <th className="border border-gray-300 p-2">Late</th>
              <th className="border border-gray-300 p-2">Tax</th>
              <th className="border border-gray-300 p-2">Net Pay</th>
              <th className="border border-gray-300 p-2">Payroll Type</th>
            </tr>
          </thead>
          <tbody>
                {payrollData.map((payroll, index) => (
                    <tr key={`${payroll.faculty_id}-${index}`}>
                    <td className="border border-gray-300 p-2">{payroll.faculty_id}</td>
                    <td className="border border-gray-300 p-2">{payroll.first_name}</td>
                    <td className="border border-gray-300 p-2">{payroll.last_name}</td>
                    <td className="border border-gray-300 p-2">{payroll.rate_type}</td>
                    <td className="border border-gray-300 p-2">{payroll.rate_value}</td>
                    <td className="border border-gray-300 p-2">{payroll.date_from}</td>
                    <td className="border border-gray-300 p-2">{payroll.date_to}</td>
                    <td className="border border-gray-300 p-2">{payroll.hours_or_days}</td>
                    <td className="border border-gray-300 p-2">{payroll.gross_amount}</td>
                    <td className="border border-gray-300 p-2">{payroll.late}</td>
                    <td className="border border-gray-300 p-2">{payroll.tax}</td>
                    <td className="border border-gray-300 p-2">{payroll.netpay}</td>
                    <td className="border border-gray-300 p-2">{payroll.payroll_type}</td>
                    </tr>
                ))}
            </tbody>

        </table>
      )}
    </div>
  );
};

export default Gagu;
