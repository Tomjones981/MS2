import React, { useState, useEffect } from 'react';
import { DatePicker, Spin } from 'antd';
import axiosClient from '../../../../../api/axiosClient';
import moment from 'moment';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Status_Counts = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [pendingCount, setPendingCount] = useState(null);
    const [releasedCount, setReleasedCount] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDate && selectedDate.isValid()) {
            fetchStatusCounts();
        }
    }, [selectedDate]); // Fetch status counts whenever selectedDate changes

    const handleMonthChange = (date) => {
        // Ensure the date is valid before setting
        if (date && date.isValid()) {
            setSelectedDate(date); // Automatically set the date and trigger the API call
        } else {
            setSelectedDate(null); // Reset if invalid
        }
    };

    const fetchStatusCounts = async () => {
        const month = selectedDate.month() + 1; // 1-indexed month
        const year = selectedDate.year(); // Extract year

        setLoading(true);

        try {
            const response = await axiosClient.get('/get-faculty-monthly-salary-status', {
                params: {
                    month: month,
                    year: year,
                }
            });

            const data = response.data;
            setPendingCount(data.pending_count);
            setReleasedCount(data.released_count);
        } catch (error) {
            console.error('Error fetching salary status counts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Data for PieChart
    const data = [
        { name: 'Pending', value: pendingCount },
        { name: 'Released', value: releasedCount }
    ];

    // Pie chart colors
    const COLORS = ['#FF8042', '#00C49F'];

    return (
        <div className='mt-2 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
            <div className='container mx-auto p-4 relative overflow-x-auto no-scrollbar'>
                <h1 className='text-lg font-semibold mb-5 text-gray-800 dark:text-white uppercase'>Salary Status Counts</h1>
                <div>
                    {/* <label htmlFor="month">Month: </label> */}
                    <DatePicker
                        value={selectedDate && selectedDate.isValid() ? selectedDate : null}  
                        onChange={handleMonthChange}
                        picker="month"
                        className="h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        format="YYYY-MM"
                        placeholder="Select Month"
                    />
                </div>

                {loading && (
                    <div className="mt-3">
                        <Spin />
                    </div>
                )}

                {pendingCount !== null && releasedCount !== null && (
                    <div> 
                        <div className="flex justify-center items-center -mt-[2rem]">
                            <PieChart  width={400} height={400}>
                                <Pie 
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip  />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Status_Counts;
