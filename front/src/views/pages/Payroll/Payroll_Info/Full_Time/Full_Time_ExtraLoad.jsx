 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FiShare } from 'react-icons/fi';
import axiosClient from '../../../../../api/axiosClient';
import { BeatLoader } from 'react-spinners'; 
import { DatePicker, Space } from 'antd';
import printIcon from '../../../../../assets/images/print.png'
import excelIcon from '../../../../../assets/images/excel.png' 
import { AiOutlineEye } from 'react-icons/ai';

const { RangePicker } = DatePicker;


const Full_Time_ExtraLoad = () => {
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
            const response = await axiosClient.get('/full_time/extraload', {
                params: {
                    start_date: selectedDates[0],
                    end_date: selectedDates[1],
                },
            });
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

    const handleViewAttendance = (facultyId, rateValue, totalHours, amountGross, adjustmentAmount, totalLate, withholdingTax, netPay) => {
        navigate(`/attendance-full-time-extraload-details/${facultyId}`, {
            state: { selectedDates, rateValue, totalHours, amountGross, adjustmentAmount, totalLate, withholdingTax, netPay },  
        });
    };

    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date);  
        const startDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[1]);
        
        return itemDate >= startDate && itemDate <= endDate;  
    });

    return (
        <> 
            <div className="col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
                <div className="flex flex-col items-start mb-5">
                    <div className="flex w-full justify-between items-center">
                        <h1 className="font-semibold text-xl dark:text-white uppercase">FULL TIME EXTRA LOAD</h1>
                        <div className="flex space-x-2">  
                            <button type="button" className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"  >Save   </button>
                        </div>
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
                        <div className="max-h-[22rem] overflow-y-auto">
                            <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
                                <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200"> 
                                    <tr>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Faculty Name</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Rate</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Hours</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Gross</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Adjustments (hr) & (U/T)</th> 
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
                                            const amountGross = parseFloat(item.rate_value) * parseFloat(item.total_hours_deducted);
                                            const withholdingTax = amountGross * 0.08;
                                            const lateHours = convertToHours(item.total_late);
                                            const adjustmentHours = adjustments[item.faculty_id] || 0;
                                            const adjustmentAmount = adjustmentHours * parseFloat(item.rate_value); 
                                            const adjustmentHoursUT = adjustmentsUT[item.faculty_id] || 0;
                                            const adjustmentAmountUT = adjustmentHoursUT * parseFloat(item.rate_value); 
                                            const lateDeduction = lateHours * parseFloat(item.rate_value);
                                            const netPay = amountGross + adjustmentAmount - lateDeduction -adjustmentAmountUT - withholdingTax;

                                            return (
                                                <tr key={item.faculty_id} className="border border-slate-300 bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:border-slate-600">
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{item.full_name}</td>
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">₱{parseFloat(item.rate_value).toFixed(2)}</td>
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">{item.total_hours_deducted.toFixed(2)}</td>
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">₱{amountGross.toFixed(2)}</td>
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">
                                                        <input
                                                            type="number" 
                                                            value={adjustments[item.faculty_id] || ''}
                                                            onChange={(e) => handleAdjustmentChange(item.faculty_id, e.target.value)}
                                                            className="block w-full px-2 py-1 text-center bg-gray-50 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                                            placeholder="0"
                                                        />
                                                    </td> 
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">{item.total_late}</td>
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">₱{withholdingTax.toFixed(2)}</td>
                                                    <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">₱{netPay.toFixed(2)}</td>
                                                     
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                    )} 
                </div>
            </div>
        </>
        
    );
};

export default Full_Time_ExtraLoad;
