 
import React, { useState } from 'react';  
import axiosClient from '../../../../api/axiosClient';
import { DatePicker, Typography, Space, Button } from 'antd'; 
import { useNavigate } from 'react-router-dom';  

const { RangePicker } = DatePicker;

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Full_Time_Calculations = () => {
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
    try {
      const response = await axiosClient.get('/attendance-salary', {
        params: {
          start_date: selectedDates[0],
          end_date: selectedDates[1],
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
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
  try { 
    const { data: existingPayrolls } = await axiosClient.get('/check-existing-payroll', {
      params: {
        date_from: startDate,
        date_to: endDate,
        payroll_type: 'ft_payroll'
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
          payroll_type: 'ft_payroll',
        };
      });
 
    if (payrollDataArray.length > 0) {
      await axiosClient.post('/save-generated-payroll', { payroll_data: payrollDataArray });
      alert('Payroll data saved successfully.');
    } else {
      // alert('No new payroll data to save for the specified period.');
      alert('Already Exist Date range Data.');
    }
  } catch (error) {
    console.error('Error saving payroll data:', error);
    alert('Failed to save payroll data.');
  }
};




  return (
    <div>
      <div className="col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-start mb-5">
          <div className="flex w-full justify-between items-center">
            <h1 className="font-semibold text-xl dark:text-white uppercase">Full Time Faculties</h1>
        
            <button type="button" onClick={handleSavePayroll} className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"   >Save   </button>
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
              <button type="submit" className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Generate</button>
            </div>
            <div className="relative col-span-3 flex items-end">
              <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
            </div>
          </div>
        </form>
        <div className="relative overflow-x-auto">
          <div className="max-h-[22rem] overflow-y-auto mb-4">
            {filteredData.length > 0 ? (
              <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
                <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Faculty Name</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Monthly</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Work Days</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">No. of working days</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Gross</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Late</th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Withholding Tax</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Net Pay</th> 
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => { 
                    const grossSalary = (item.monthly_rate / workDays) * (item.total_present || 0);
                    const withholdingTax = item.monthly_rate >= 25000 ? ((item.monthly_rate * 12 - 250000) * 0.15 / 12 / 2) : 0; 
                    const lateHours = convertToHours(item.total_late_time) || 0;
                    const adjustmentHours = adjustments[item.faculty_id] || 0;  
                    const adjustmentAmount = adjustmentHours * parseFloat(item.rate_value);   
                    const lateDeduction = lateHours * parseFloat(item.rate_value) || 0; 
                    const netPay = grossSalary + adjustmentAmount - lateDeduction - withholdingTax;

                    return (
                      <tr key={index} className="bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-slate-200">
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{item.full_name}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{item.monthly_rate}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">{workDays}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">{item.total_present || 0}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(grossSalary.toFixed(2))}</td> 
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">{item.total_late_time}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{withholdingTax.toFixed(2)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600">₱{formatNumber(netPay.toFixed(2))}</td>
                     
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
        </div>
      </div>
    </div>
  );
};

export default Full_Time_Calculations;
