import React, { useEffect, useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import axiosClient from '../../../../../../api/axiosClient';
import { Modal, Button } from 'flowbite-react';
import { useCallback } from 'react';
import _ from 'lodash';
const PWD_Total_List = () => {
    const [barangayData, setBarangayData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBarangay, setSelectedBarangay] = useState(null);
    const [details, setDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axiosClient.get('/pwd-brgy-report-counts')
            .then(response => {
                setBarangayData(response.data.barangay_counts);
                setTotalCount(response.data.total_count);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching data');
                setLoading(false);
            });
    }, []);

    const fetchBarangayDetails = (barangay) => {
        setSelectedBarangay(barangay);
        setLoadingDetails(true);
        setIsModalOpen(true);

        axiosClient.get(`/pwd-brgy-report-view-age-by-gender/${barangay}`)
            .then(response => {
                setDetails(response.data);
                setLoadingDetails(false);
            })
            .catch(error => {
                console.error("Error fetching barangay details:", error);
                setError('Error fetching barangay details');
                setLoadingDetails(false);
            });
    };

//     const fetchBarangayDetails = useCallback(_.debounce((barangay) => {
//     setSelectedBarangay(barangay);
//     setLoadingDetails(true);
//     setIsModalOpen(true);

//     axiosClient.get(`/pwd-brgy-report-view-age-by-gender/${barangay}`)
//         .then(response => {
//             setDetails(response.data);
//             setLoadingDetails(false);
//         })
//         .catch(() => {
//             setError('Error fetching barangay details');
//             setLoadingDetails(false);
//         });
// }, 500), []);

    return (
        <div className='p-5'> 
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="lg:grid grid-cols-3 gap-4">
                        <div className='border border-gray-100 dark:border-gray-700 col-span-2  bg-white p-5 rounded-2xl  flex items-center justify-center hover:shadow-2xl hover:bg-gray-300 transition-all dark:bg-gray-800 dark:hover:bg-gray-700'>
                            <div>
                                <h2 className='text-md font-semibold text-gray-600 dark:text-gray-200 font-light text-center'>
                                    TOTAL
                                </h2>
                                <p className='font-light text-yellow-600 dark:text-blue-400'>
                                    Total List of PWD's in OPOL
                                </p>
                            </div>
                            <p className='font-light font-extrabold text-gray-200 dark:text-gray-800 text-2xl bg-gray-500 dark:bg-gray-200 rounded-full p-2'>
                                {totalCount}
                            </p>
                        </div>

                        {barangayData.map((item, index) => (
                            <div key={index} className="border border-gray-100 dark:border-gray-700 bg-white p-5 rounded-2xl  flex items-center justify-between hover:shadow-2xl transition-all dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div>
                                    <h2 className="text-md font-semibold text-gray-600 dark:text-gray-200 font-light">
                                        {item.barangay}
                                    </h2>
                                    <p className="text-xs font-light text-green-600 dark:text-green-400">
                                        List of {item.barangay} PWD
                                    </p>
                                </div>
                                <p className="font-medium font-extrabold text-blue-500 dark:text-blue-400 text-2xl">
                                    {item.count}
                                </p>
                                <button 
                                    className='border border-gray-100 dark:border-gray-500 font-light -mt-20 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-400 transform scale-100 hover:scale-110 transition-all duration-300'
                                    onClick={() => fetchBarangayDetails(item.barangay)}
                                >
                                    <FaRegEye className='text-blue-500 font-semibold hover:text-gray-100 cursor-pointer'/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
    
                <Modal show={isModalOpen}   onClose={() => setIsModalOpen(false)}>
                    <Modal.Header>
                        <h1 className='font-light'>{selectedBarangay} - Age Group Details</h1>
                    </Modal.Header>
                    <Modal.Body>
                        {loadingDetails ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <table className="w-full mt-3 border-collapse border border-gray-100 dark:border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-300 dark:bg-gray-700">
                                            <th className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">Age Group</th>
                                            <th className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">Male Count</th>
                                            <th className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">Female Count</th>
                                            <th className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.length > 0 ? details.map((row, index) => (
                                            <tr key={index} className="text-center bg-gray-100 dark:bg-gray-700">
                                                <td className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">{row.age_group}</td>
                                                <td className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">{row.male_count}</td>
                                                <td className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">{row.female_count}</td>
                                                <td className="font-light text-gray-700 dark:text-gray-200 p-2 border border-gray-400 dark:border-gray-700">{row.total_count}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="font-light p-2 text-center text-gray-500">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                
                                {details.length > 0 && (
                                    <div className="mt-3 text-right pr-5">
                                        <p className="font-light font-bold text-gray-700 dark:text-gray-200">TOTAL: 
                                            <span className="ml-2 text-blue-600 dark:text-blue-400">
                                                {details.reduce((sum, row) => sum + row.total_count, 0)}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => setIsModalOpen(false)} ><p className='font-light'>Close</p></Button>
                    </Modal.Footer>
                </Modal>
            {/* </div> */}
        </div>
    );
};

export default PWD_Total_List;