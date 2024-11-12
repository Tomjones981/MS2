 
import React, { useState } from 'react';  
import axiosClient from '../../../../api/axiosClient';
import { DatePicker, Typography, Space, Button, message } from 'antd'; 
import { useNavigate } from 'react-router-dom';  
import { BeatLoader } from 'react-spinners'; 

const { RangePicker } = DatePicker;

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Program_Heads_Calculations = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [selectMonth, setSelectMonth] = useState(null);
  const [workDays, setWorkDays] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [adjustments, setAdjustments] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);

  const navigate = useNavigate();  

  const handleAdjustmentChange = (facultyId, value) => {
    setAdjustments((prevAdjustments) => ({
      ...prevAdjustments,
      [facultyId]: parseFloat(value) || 0,
    }));
  };

  const calculateWeekdays = (date) => {
    if (!date) return;

    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let weekdaysCount = 0;
    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
      const dayOfWeek = day.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        weekdaysCount++;
      }
    }

    setWorkDays(weekdaysCount);
  };

  const handleMonthChange = (date, dateString) => {
    setSelectMonth(date);
    calculateWeekdays(date);
  };

  const handleRangeChange = (dates, dateStrings) => {
    setSelectedDates(dateStrings);  
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.get('/attendance-salary/program/heads', {
        params: {
          start_date: selectedDates[0],
          end_date: selectedDates[1],
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const convertToHours = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours + minutes / 60 + seconds / 3600;
  };

  const handleViewAttendance = (facultyId, MonthlyRate, workDays, TotalPresent, grossSalary, adjustmentAmount, TotalLateTime, withholdingTax, netPay) => {
    navigate(`/attendance-full-time-details/${facultyId}`, {
        state: { selectedDates, MonthlyRate, workDays, TotalPresent, grossSalary, adjustmentAmount, TotalLateTime, withholdingTax, netPay },  
    });
}; 

const handleSavePayroll = async () => {
  setLoadingSave(true);
  try { 
    const { data: existingPayrolls } = await axiosClient.get('/check-existing-payroll', {
      params: {
        date_from: startDate,
        date_to: endDate,
        payroll_type: 'ph_payroll'
      }
    });
 
    const existingFacultyIds = new Set(existingPayrolls.map(record => record.faculty_id));
 
    const payrollDataArray = filteredData
      .filter(item => !existingFacultyIds.has(item.faculty_id))
      .map(item => {
        const grossSalary = (item.monthly_rate / workDays) * (item.total_present || 0);
        const withholdingTax = item.monthly_rate >= 25000 ? ((item.monthly_rate * 12 - 250000) * 0.15 / 12 / 2) : 0;
        const lateHours = convertToHours(item.total_late_time) || 0;
        const adjustmentHours = adjustments[item.faculty_id] || 0;
        const adjustmentAmount = adjustmentHours * parseFloat(item.rate_value);
        const lateDeduction = lateHours * parseFloat(item.rate_value) || 0;
        const netPay = grossSalary + adjustmentAmount - lateDeduction - withholdingTax;

        return {
          faculty_id: item.faculty_id,
          date_from: startDate,
          date_to: endDate,
          hours_or_days: item.total_present.toString(),
          gross_amount: grossSalary.toFixed(2),
          late: item.total_late_time,
          tax: withholdingTax.toFixed(2),
          netpay: netPay.toFixed(2),
          payroll_type: 'ph_payroll',
        };
      });
 
    if (payrollDataArray.length > 0) {
      await axiosClient.post('/save-generated-payroll', { payroll_data: payrollDataArray });
      message.success('Payroll data saved successfully.');
    } else {
      // alert('No new payroll data to save for the specified period.');
      message.error('Already Exist Date range Data.');
    }
  } catch (error) {
    console.error('Error saving payroll data:', error);
    message.error('Failed to save payroll data.');
  }finally {
    setLoadingSave(false);
  }
};

  return (
    <div>
      <div className="col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-start mb-5">
          <div className="flex w-full justify-between items-center">
            <h1 className="font-semibold text-xl dark:text-white uppercase">Program Heads Faculties</h1> 
            <button type="button" onClick={handleSavePayroll} className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"    >
              {loadingSave ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                </svg>
                ) : (
                <> 
                  Save
                </>
              )}    
            </button>
          </div>
          <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} />
        </div>
        <form onSubmit={handleSubmit}>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Month</label>
              <DatePicker value={selectMonth} onChange={handleMonthChange} picker="month" className='h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' />
            </div>
          <div className="grid grid-cols-10 mt-2 mb-2 gap-4"> 
            <div className="col-span-7">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Date Range</label>
              <Space direction="vertical" size={12} className='text-gray-700 dark:text-gray-200'>
                <RangePicker onChange={handleRangeChange} className='h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' />
              </Space>
              <button type="submit" disabled={loading} className={`hover:scale-110 flex justify-center items-center gap-2 text-white bg-gradient-to-br from-gray-600 to-blue-900 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-11 py-3 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 -mt-[2.7rem] ml-[20rem] ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                  </svg>
                  ) : (
                  <> 
                    Generate
                  </>
                )} 
              </button>
            </div>
            <div className="relative col-span-3 flex items-end">
              <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
            </div>
          </div>
        </form>

        <div className="relative overflow-x-auto"> 
        {loading ? (
                        <div className="flex justify-center"><BeatLoader size={12} /></div>
                    ) : (
          <div className="max-h-[22rem] overflow-y-auto mb-4">
            {filteredData.length > 0 ? (
              <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
                <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Faculty Name</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Monthly</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Work Days</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">No. of working days</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Gross</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Late</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Withholding Tax</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Net Pay</th> 
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => { 
                    const grossSalary = (item.monthly_rate / workDays) * (item.total_present || 0);
                    // const withholdingTax = item.monthly_rate >= 25000   ? ((item.monthly_rate * 12 - 250000) * 0.15 / 12 / 2) : 0; 
                    const withholdingTax = item.monthly_rate >= 30000 
                      ? ((item.monthly_rate * 12 - 250000) * 0.15 / 12 / 2) 
                      : item.monthly_rate >= 25000 
                      ? ((item.monthly_rate * 12 - 250000) * 0.15 / 12 / 2)  
                      : 0; 
                    const lateHours = convertToHours(item.total_late_time) || 0;
                    const adjustmentHours = adjustments[item.faculty_id] || 0;  
                    const adjustmentAmount = adjustmentHours * parseFloat(item.rate_value);   
                    const lateDeduction = lateHours * parseFloat(item.rate_value) || 0; 
                    const netPay = grossSalary + adjustmentAmount - lateDeduction - withholdingTax;

                    return (
                      <tr key={index} className="bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-slate-200">
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{item.full_name}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">₱{item.monthly_rate}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">{workDays}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">{item.total_present || 0}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">₱{formatNumber(grossSalary.toFixed(2))}</td> 
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">{item.total_late_time}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">₱{withholdingTax.toFixed(2)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">₱{formatNumber(netPay.toFixed(2))}</td>
                     
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div> 
                    )}
        </div>
      </div>
    </div>
  );
};

export default Program_Heads_Calculations;
