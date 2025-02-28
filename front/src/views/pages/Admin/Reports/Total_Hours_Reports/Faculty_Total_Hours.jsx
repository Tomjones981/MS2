import React, { useEffect, useState } from 'react';
import { Pagination, DatePicker } from 'antd';
import dayjs from 'dayjs';
import axiosClient from '../../../../../api/axiosClient';

const Faculty_Total_Hours = () => {
    const [facultyHours, setFacultyHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedYear, setSelectedYear] = useState(dayjs().year()); // Default to current year
    const [searchQuery, setSearchQuery] = useState(''); // For search functionality

    const fetchFacultyHours = (year) => {
        setLoading(true);
        axiosClient
            .get('/get-faculty-monthly-hours', { params: { year } })
            .then((response) => {
                setFacultyHours(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('There was an error fetching the data!', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchFacultyHours(selectedYear);
    }, [selectedYear]);

    const handleYearChange = (date) => {
        if (date) {
            setSelectedYear(date.year());
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    // Filter by search query
    const filteredData = facultyHours.filter((faculty) =>
        faculty.full_name.toLowerCase().includes(searchQuery)
    );

    // Paginate the filtered data
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="mt-2 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="container mx-auto p-4 relative overflow-x-auto no-scrollbar">
                <h2 className="text-lg font-semibold mb-5 text-gray-800 dark:text-white uppercase">
                    Faculty Monthly Total Worked Hours
                </h2>
                <div className="flex justify-between items-center mb-4">
                    <DatePicker
                        picker="year"
                        onChange={handleYearChange}
                        defaultValue={dayjs()}
                        className="h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    />
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none ">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange} className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search name"
                        />
                    </div>
                    
                </div>
                <div className="max-h-[20rem] overflow-y-auto">
                    <table className="table-auto w-full bg-white border border-gray-300">
                        <thead className="sticky -top-1 text-sm text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                            <tr>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">Full Name</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">January</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">February</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">March</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">April</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">May</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">June</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">July</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">August</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">September</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">October</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">November</th>
                                <th className="px-4 py-2 border border-slate-300 dark:border-slate-600">December</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="13" className="text-center py-10">
                                        <svg
                                            className="animate-spin h-5 w-5 text-gray-600 dark:text-white mx-auto"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                                            ></path>
                                        </svg>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="13"
                                        className="text-center py-10 text-gray-600 bg-white dark:bg-gray-700 border border-slate-300 dark:border-slate-600 dark:text-gray-200"
                                    >
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((faculty, index) => (
                                    <tr key={index} className='dark:bg-gray-800 border-b dark:border-gray-700 dark:border-slate-600 dark:text-gray-400'>
                                        <td className="border px-4 py-2 border-slate-300 dark:border-slate-600 text-center">
                                            {faculty.full_name}
                                        </td>
                                        {[
                                            'january',
                                            'february',
                                            'march',
                                            'april',
                                            'may',
                                            'june',
                                            'july',
                                            'august',
                                            'september',
                                            'october',
                                            'november',
                                            'december',
                                        ].map((month) => (
                                            <td
                                                key={month}
                                                className="border px-4 py-2 border-slate-300 dark:border-slate-600 text-center"
                                            >
                                                {Number.isInteger(faculty[month])
                                                    ? faculty[month]
                                                    : faculty[month]?.toFixed(2)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-center">
                    <Pagination
                        className="mt-4"
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        showSizeChanger
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageChange}
                        pageSizeOptions={['10', '20', '50', '100']}
                    />
                </div>
            </div>
        </div>
    );
};

export default Faculty_Total_Hours;
