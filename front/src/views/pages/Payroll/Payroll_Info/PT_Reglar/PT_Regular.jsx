 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axiosClient from '../../../../../api/axiosClient';
import { BeatLoader } from 'react-spinners'; 
import { DatePicker, Space } from 'antd'; 

const { RangePicker } = DatePicker;
 
const PT_Regular = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [adjustments, setAdjustments] = useState({});
    const [adjustmentsUT, setAdjustmentsUT] = useState({});
    const [selectedDates, setSelectedDates] = useState([]);
    const navigate = useNavigate();  

    const handleAdjustmentChange = (facultyId, value) => {
        setAdjustments((prevAdjustments) => ({
            ...prevAdjustments,
            [facultyId]: parseFloat(value) || 0,
        }));
    };
    const handleAdjustmentUTChange = (facultyId, value) => {
        setAdjustmentsUT((prevAdjustmentsUT) => ({
            ...prevAdjustmentsUT,
            [facultyId]: parseFloat(value) || 0,
        }));
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/part-time-regular-data', {
                params: {
                    start_date: selectedDates[0],
                    end_date: selectedDates[1],
                },
            });
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDates.length === 2) {
            fetchData();
        } else {
            alert('Please select both start and end dates.');
        }
    };

    const convertToHours = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours + minutes / 60;
    };

     
    const handleDateChange = (dates, dateStrings) => {
        setSelectedDates(dateStrings);
    };

    const handleViewAttendance = (facultyId, totalLate, rateValue, HoursWork, amountGross, adjustmentAmount, withholdingTax, netPay) => {
        navigate(`/attendance-part-time-details/${facultyId}`, {
            state: {   selectedDates,totalLate, rateValue, HoursWork, amountGross, adjustmentAmount, withholdingTax, netPay },   
        });
    };

    const filteredData = Array.isArray(data)
    ? data.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[1]);
        return itemDate >= startDate && itemDate <= endDate;
    })
    : [];

    const handleSavePayroll = async () => {
        try { 
          // Use selectedDates directly for date_from and date_to
          const { data: existingPayrolls } = await axiosClient.get('/check-existing-payroll', {
            params: {
              date_from: selectedDates[0],  // Use the selected dates directly
              date_to: selectedDates[1],
              payroll_type: 'ptr_payroll'
            }
          });
       
          const existingFacultyIds = new Set(existingPayrolls.map(record => record.faculty_id));
       
          const payrollDataArray = data
            .filter(item => !existingFacultyIds.has(item.faculty_id))
            .map(item => {
                // const monthTotalHours = parseFloat(item.total_monday) + parseFloat(item.total_tuesday) + parseFloat(item.total_wednesday) + parseFloat(item.total_thursday) + parseFloat(item.total_friday) + parseFloat(item.total_saturday);
                const monthTotalHours = [
                    item.total_monday, 
                    item.total_tuesday, 
                    item.total_wednesday, 
                    item.total_thursday, 
                    item.total_friday, 
                    item.total_saturday
                  ].reduce((acc, day) => acc + (parseFloat(day) || 0), 0);
                  
                const amountGross = parseFloat(item.rate_value) * parseFloat(monthTotalHours);
                const withholdingTax = amountGross * 0.08;
                const lateHours = convertToHours(item.total_late_time);
                const adjustmentHours = adjustments[item.faculty_id] || 0;
                const adjustmentAmount = adjustmentHours * parseFloat(item.rate_value); 
                const adjustmentHoursUT = adjustmentsUT[item.faculty_id] || 0;
                const adjustmentAmountUT = adjustmentHoursUT * parseFloat(item.rate_value); 
                const lateDeduction = lateHours * parseFloat(item.rate_value);
                const netPay = amountGross + adjustmentAmount - lateDeduction - adjustmentAmountUT - withholdingTax;
      
              return {
                faculty_id: item.faculty_id,
                date_from: selectedDates[0],  
                date_to: selectedDates[1],
                // hours_or_days: item.monthTotalHours.toString(),
                hours_or_days: isNaN(monthTotalHours) ? '0' : monthTotalHours.toString(), 
                gross_amount: amountGross.toFixed(2),
                late: item.total_late_time,
                tax: withholdingTax.toFixed(2),
                netpay: netPay.toFixed(2),
                payroll_type: 'ptr_payroll',
              };
            });
       
          if (payrollDataArray.length > 0) {
            await axiosClient.post('/save-generated-payroll', { payroll_data: payrollDataArray });
            console.log('Payroll Data Saved');
            alert('Payroll data saved successfully.');
          } else {
            alert('Already Exist Date range Data.');
          }
        } catch (error) {
            console.error('Error saving payroll data:', error.response || error);
            alert('Failed to save payroll data.');
        }
    };


    return (
        <> 
            <div className="col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
                <div className="flex flex-col items-start mb-5">
                    <div className="flex w-full justify-between items-center">
                        <h1 className="font-semibold text-xl dark:text-white uppercase">PT Regular Faculties</h1>
                        <button type="button" onClick={handleSavePayroll} className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"  >Save   </button>
                    </div>
                    <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} /> 
                </div>

                <form >
                    <div className="grid grid-cols-10 mt-2 mb-2 gap-4">
                        <div className="col-span-7">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Date Range</label>
                            <Space direction="vertical" size={12} className='text-gray-700 dark:text-gray-200'>
                                <RangePicker onChange={handleDateChange} className='h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'/> 
                            </Space>
                            <button type="submit" onClick={handleSubmit} className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Generate </button>
                        </div> 
                        <div className="relative col-span-3 flex items-end">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="mt-6 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" /></svg>
                            </div>
                            <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
                        </div>
                    </div>
                </form>

                <div className="relative overflow-x-auto mt-5">
                    {loading ? (
                        <div className="flex justify-center"><BeatLoader size={12} /></div>
                    ) : (
                        <div className="relative overflow-x-auto no-scrollbar ">
                            <div className="max-h-[22rem] overflow-y-auto mb-4">
                                <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500  dark:text-gray-400 border-collapse border border-slate-200">
                                    <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200"> 
                                        <tr>
                                            <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Faculty Name</th>
                                            <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Rate</th>
                                            <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Hours</th>
                                            <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Gross</th> 
                                            <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Late</th>
                                            <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Tax</th>
                                            <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Net Pay</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center">No data available</td>
                                            </tr>
                                        ) : (
                                            data.filter((item) => item.full_name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => {
                                                const monthTotalHours = parseFloat(item.total_monday) + parseFloat(item.total_tuesday) + parseFloat(item.total_wednesday) + parseFloat(item.total_thursday) + parseFloat(item.total_friday) + parseFloat(item.total_saturday);
                                                const amountGross = parseFloat(item.rate_value) * parseFloat(monthTotalHours);
                                                const withholdingTax = amountGross * 0.08;
                                                const lateHours = convertToHours(item.total_late_time);
                                                const adjustmentHours = adjustments[item.faculty_id] || 0;
                                                const adjustmentAmount = adjustmentHours * parseFloat(item.rate_value); 
                                                const adjustmentHoursUT = adjustmentsUT[item.faculty_id] || 0;
                                                const adjustmentAmountUT = adjustmentHoursUT * parseFloat(item.rate_value); 
                                                const lateDeduction = lateHours * parseFloat(item.rate_value);
                                                const netPay = amountGross + adjustmentAmount - lateDeduction -adjustmentAmountUT - withholdingTax;

                                                return (
                                                    <tr key={item.faculty_id} className="border border-slate-300 bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:border-slate-600">
                                                        <td className="border border-slate-300 px-6 py-3 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{item.full_name}</td>
                                                        <td className="border border-slate-300 px-6 py-3 dark:border-slate-600 text-center">₱{parseFloat(item.rate_value).toFixed(2)}</td>
                                                        <td className="border border-slate-300 px-6 py-3 dark:border-slate-600 text-center"> {monthTotalHours.toFixed(2)}</td>  
                                                        <td className="border border-slate-300 px-6 py-3 dark:border-slate-600 text-center">₱{amountGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td> 
                                                        <td className="border border-slate-300 px-6 py-3 dark:border-slate-600 text-center">{item.total_late_time}</td>
                                                        <td className="border border-slate-300 px-6 py-3 dark:border-slate-600 text-center">₱{withholdingTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        <td className="border border-slate-300 px-6 py-3 dark:border-slate-600 text-center">₱{netPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                   
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table> 
                            </div> 
                        </div>
                        
                    )}
                </div>
            </div>
        </>
        
    );
};

export default PT_Regular;
