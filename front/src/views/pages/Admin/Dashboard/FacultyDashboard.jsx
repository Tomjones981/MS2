 
import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import axiosClient from '../../../../api/axiosClient';
import { BeatLoader } from 'react-spinners';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const FacultyDashboard = () => {
    const [totalFaculties, setTotalFaculties] = useState(0);
    const [totalFacultiesFullTime, setTotalFacultiesFullTime] = useState(0);
    const [totalFacultiesPartTime, setTotalFacultiesPartTime] = useState(0);
    const [totalFacultiesActive, setTotalFacultiesActive] = useState(0);
    const [totalFacultiesInactive, setTotalFacultiesInactive] = useState(0);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const totalFacultiesRes = await axiosClient.get('/get_total/faculties');
                const fullTimeRes = await axiosClient.get('/get_total/faculties/full_time');
                const partTimeRes = await axiosClient.get('/get_total/faculties/part_time');
                const activeRes = await axiosClient.get('/get_total/faculties/active');
                const inactiveRes = await axiosClient.get('/get_total/faculties/inactive');
                
                setTotalFaculties(totalFacultiesRes.data.total_faculties);
                setTotalFacultiesFullTime(fullTimeRes.data.total_full_time_faculties);
                setTotalFacultiesPartTime(partTimeRes.data.total_part_time_faculties);
                setTotalFacultiesActive(activeRes.data.total_active_faculties);
                setTotalFacultiesInactive(inactiveRes.data.total_inactive_faculties);
            } catch (error) {
                console.error('Error fetching faculty data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);
  
// Faculty Type Pie Chart (Part-Time: Light Blue, Full-Time: Light Green)
const pieDataFacultyType = {
    labels: ['Part-Time', 'Full-Time'],
    datasets: [
        {
            data: [totalFacultiesPartTime, totalFacultiesFullTime],
            backgroundColor: ['#60A5FA', '#68D391'], // Light Blue and Light Green
            hoverBackgroundColor: ['#93C5FD', '#9AE6B4'], // Lighter shades for hover
        },
    ],
};

// Faculty Status Pie Chart (Active: Cyan, Inactive: Red)
const pieDataFacultyStatus = {
    labels: ['Active', 'Inactive'],
    datasets: [
        {
            data: [totalFacultiesActive, totalFacultiesInactive],
            backgroundColor: ['#319795', '#E53E3E'], // Cyan and Red
            hoverBackgroundColor: ['#4FD1C5', '#F56565'], // Lighter Cyan and Red for hover
        },
    ],
};

// Bar Chart (Part-Time: Light Blue, Full-Time: Light Green, Active: Cyan, Inactive: Red)
const barData = {
    labels: ['Part-Time', 'Full-Time', 'Active', 'Inactive'],
    datasets: [
        {
            label: 'Faculty Count',
            data: [totalFacultiesPartTime, totalFacultiesFullTime, totalFacultiesActive, totalFacultiesInactive],
            backgroundColor: [
                '#60A5FA', // Light Blue for Part-Time
                '#68D391', // Light Green for Full-Time
                '#319795', // Cyan for Active
                '#E53E3E', // Red for Inactive
            ],
        },
    ],
};




    return (
        <div>
            <h2>Faculty Dashboard</h2>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <BeatLoader color="#36A2EB" />
                </div>
            ) : (
                <> 
                    <div className='grid grid-cols-2 gap-5 bg-white p-3 rounded-lg shadow-md flex items-center justify-between dark:bg-gray-800'>
                        <div className='' style={{ width: '300px', margin: '20px auto' }}>
                            <h3>Part-Time vs Full-Time</h3>
                            <Pie data={pieDataFacultyType} />
                        </div>
    
                        <div style={{ width: '300px', margin: '20px auto' }}>
                            <h3>Active vs Inactive</h3>
                            <Pie data={pieDataFacultyStatus} />
                        </div>
                    </div>
                    
                    <div className=' bg-white p-3 rounded-lg shadow-md mt-5'>
                        <div style={{ width: '600px', margin: '20px auto' }}>
                            <h3>Faculty Comparison</h3>
                            <Bar data={barData} />
                        </div>
 
                        <div style={{ margin: '20px auto', width: '600px' }}>
                            <h3>Faculty Details</h3>
                            <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'center' }}>
                                <thead>
                                    <tr>
                                        <th>Total Faculties</th>
                                        <th>Part-Time</th>
                                        <th>Full-Time</th>
                                        <th>Active</th>
                                        <th>Inactive</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{totalFaculties}</td>
                                        <td>{totalFacultiesPartTime}</td>
                                        <td>{totalFacultiesFullTime}</td>
                                        <td>{totalFacultiesActive}</td>
                                        <td>{totalFacultiesInactive}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                
                    
                </>
            )}
        </div>
    );
};

export default FacultyDashboard;
