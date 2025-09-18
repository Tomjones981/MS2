 
import React, { useState, forwardRef, useEffect } from "react";
import { DatePicker, message } from 'antd';  
import axiosClient from '../../../../api/axiosClient'
import { useNavigate } from "react-router-dom";
import moment from "moment"
import { FiPlus } from "react-icons/fi";
import { Modal } from "flowbite-react";
import { FaFolderOpen } from "react-icons/fa"; 
import { FaEllipsisV } from "react-icons/fa";

const Yearly_List = () => { 
    const [loading, setLoading] = useState(false);


    const [year, setYear] = useState(null);
    const [years, setYears] = useState([]);

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/year-fetching");
            setYears(response.data);
        } catch (error) {
            console.error("Error fetching years:", error);
        }
        setLoading(false);
    };

    const handleDateChange = (date, dateString) => {
        setYear(dateString);
    };

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!year) {
            message.error("Please select a year.");
            return;
        }

        try {
            const response = await axiosClient.post("/year-create", {
                year_date: year,
            });

            message.success(response.data.message);
            fetchYears(); 
            setYear(null);  
            setOpenCreateModal(false);
        } catch (err) {
            if (err.response && err.response.status === 409) {
                message.error("This year already exists.");
            } else {
                message.error("An error occurred while adding the year.");
            }
        }
    };

    const navigate = useNavigate();
    const handleView = (yearId) => {
        navigate(`/brgy-sectors/${yearId}`);
    };


    return ( 
        <div className="h-[21rem] p-5">
            <div className="max-h-[50rem] overflow-y-auto mt-1 w-full p-5 bg-white border border-gray-200 rounded-lg  dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center p-2 mb-2 -mt-3       dark:bg-gray-800">
                    <h1 className="text-lg font-semibold text-gray-900 font-light dark:text-gray-200">
                        Year 
                    </h1>
                    <div className="flex space-x-2 -mt-1"> 
                        <button type='button' onClick={() => setOpenCreateModal(true)} className="font-light flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg -md hover:bg-green-700 transition">
                            <FiPlus className="text-lg" />
                            Add  
                        </button>
                    </div>
                </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>
                
                <div className='grid grid-cols-10 mt-6 mb-2 gap-4 '> 
                    <div className='col-span-7'> 
                        <select name="" className='font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                            <option value="" className='font-light '>All</option> 
                        </select>
                    </div>
                    <div className="relative col-span-3 flex items-end">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-6">
                            <svg className="mb-5 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search"     className="font-light block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search year" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-4 flex justify-center items-center">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                            {[...Array(4)].map((_, index) => (
                            <div key={index} className="w-full max-w-md p-4 bg-white rounded-lg -md dark:bg-gray-800">
                                <div className="flex animate-pulse space-x-4">
                                <div className="size-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-3 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2 h-3 rounded bg-gray-300 dark:bg-gray-600"></div>
                                        <div className="col-span-1 h-3 rounded bg-gray-300 dark:bg-gray-600"></div>
                                    </div>
                                    <div className="h-3 w-5/6 rounded bg-gray-300 dark:bg-gray-600"></div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    ) : years.length > 0 ? (
                        years.map((yearData, index) => (
                        <div
                            key={index}
                            className="bg-white p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center 
                            hover:shadow-2xl transition-all dark:bg-gray-700 dark:shadow-gray-500/50 dark:hover:shadow-gray-200"
                        >
                            <button>
                            <p className="ml-[14rem] -mb-40 -mt-2 text-xs dark:text-gray-200 transform scale-200 hover:scale-110 transition-all duration-300">
                                <FaEllipsisV />
                            </p>
                            </button>
                            <p className="font-light text-gray-800 dark:text-gray-200">{yearData.year_date}</p>
                            <button
                            className="font-light -mb-10 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transform scale-100 hover:scale-110 transition-all duration-300"
                            onClick={() => handleView(yearData.id)}
                            >
                            <FaFolderOpen />
                            </button>
                        </div>
                        ))
                    ) : (
                        <p className="col-span-4 text-center">No years available</p>
                    )}
                </div>


                <Modal show={openCreateModal} size='sm' onClose={() => setOpenCreateModal(false)}>
                        <Modal.Header>
                            <h1 className="font-light">Create Date</h1>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label htmlFor="date" className="font-light mt-2 block text-md font-medium text-gray-900 dark:text-white">Year</label>
                                        <DatePicker 
                                            onChange={handleDateChange} 
                                            picker="year" 
                                            className="font-light bg-gray-50 h-9 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 w-full"
                                            value={year ? moment(year, "YYYY") : null} 
                                        />
                                    </div>
                                </div>
                                
                                <div className='flex justify-center'>
                                <button type="submit" disabled={loading}  className={`mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-light ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                            
                                    {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                                    </svg>
                                    ) : (
                                    <> 
                                        Create
                                    </>
                                    )}
                                </button>
                                </div>
                            </form>
                        </Modal.Body>
                </Modal>

            </div>
        </div> 
    );
};

export default Yearly_List;
