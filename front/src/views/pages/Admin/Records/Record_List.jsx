import React, { useState, useEffect } from 'react'
import { BeatLoader } from 'react-spinners'  
import { DatePicker, Space } from 'antd';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Button, Modal } from 'flowbite-react'; 
import {  message, Pagination } from 'antd'; 
import { FaEye, FaRegEdit } from "react-icons/fa";
import { FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import axiosClient from '../../../../api/axiosClient'
 
const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
};

const Record_List = () => {
    const [loading, setLoading] = useState(true);
    const [logBooks, setLogBooks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [preview, setPreview] = useState(null);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setPreview(URL.createObjectURL(file));
        }
      };


    const handleMonthChange = async (date, dateeString) => {

    }
    
    const [formData, setFormData] = useState({
        date: "",
        client_name: "",
        age: "",
        gender: "",
        address: "",
        purpose: "",
        beneficiary: "",
        hospital_or_institutional: "",
        contact_number: "",
        amount: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };


    const handleOpenCreateModal = () => {
        setFormData({  
            date: "",
            client_name: "",
            age: "",
            gender: "",
            address: "",
            purpose: "",
            beneficiary: "",
            hospital_or_institutional: "",
            contact_number: "",
            amount: ""
        });  
        setOpenCreateModal(true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosClient.post("/log-book-create", formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            console.log("Logbook record created:", response.data);
            message.success("Record added successfully!");
            setOpenCreateModal(false);  
            setFormData({  
                date: "",
                client_name: "",
                age: "",
                gender: "",
                address: "",
                purpose: "",
                beneficiary: "",
                hospital_or_institutional: "",
                contact_number: "",
                amount: ""
            });
            fetchLogBooks();
        } catch (error) {
            console.error("Error creating logbook record:", error.response?.data);
            message.error("Failed to create record!");
        } finally {
            setLoading(false);
        }
    };
    
    const handleDateChange = (date, dateString) => {
        setFormData({ ...formData, date: dateString });
    };

        useEffect(() => {
            fetchLogBooks();
        }, []);
    
        const fetchLogBooks = async () => {
            try {
                const response = await axiosClient.get("/log-book-fetching");
                setLogBooks(response.data);
            } catch (error) {
                console.error("Error fetching logbook data:", error);
            } finally {
                setLoading(false);
            }
        };

        const [searchTerm, setSearchTerm] = useState('');
        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };
    
        const [selectedPurpose, setSelectedPurpose] = useState('');
        const handlePurposeChange = (e) => {
            setSelectedPurpose(e.target.value);
        };
    
        const filteredLogBooks = logBooks.filter((log) => {
            return (
                (selectedPurpose === '' || log.purpose === selectedPurpose) &&
                log.client_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        const [openViewModal, setOpenViewModal] = useState(false);
        const [selectedResident, setSelectedResident] = useState(null);
        const handleViewClick = (resident) => {
            setSelectedResident(resident);
            setOpenViewModal(true);
        };


        const [openEditModal, setOpenEditModal] = useState(false);
        const [selectedLog, setSelectedLog] = useState(null);
        const handleEditClick = (record) => {
            setSelectedLog(record);
            setFormData({
                date: record.date,
                client_name: record.client_name,
                age: record.age,
                gender: record.gender,
                address: record.address,
                purpose: record.purpose,
                beneficiary: record.beneficiary,
                hospital_or_institutional: record.hospital_or_institutional,
                contact_number: record.contact_number,
                amount: record.amount
            });
            setOpenEditModal(true);
        };
        

        const handleUpdate = async (e) => {
            e.preventDefault();
            setLoading(true);
        
            try {
                const response = await axiosClient.put(`/log-book-update/${selectedLog.id}`, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
        
                message.success("Record updated successfully!");
                setOpenEditModal(false);
                fetchLogBooks();
            } catch (error) {
                console.error("Error updating logbook record:", error.response?.data);
                message.error("Failed to update record!");
            } finally {
                setLoading(false);
            }
        };

        const handleExport = async () => {
            try {
                const response = await axiosClient.get("/logbook-export", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    responseType: "blob",  
                });
         
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "logbook_records.xlsx");  
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
        
                message.success("Export successful!");
            } catch (error) {
                console.error("Error exporting logbook data:", error);
                message.error("Failed to export records!");
            }
        };

    const [importFile, setImportFile] = useState(null);    
    const [openImportModal, setOpenImportModal] = useState(false);
    const handleFileChange = (e) => {
        setImportFile(e.target.files[0]);
    };
    
    const handleImport = async () => {
        if (!importFile) {
            message.error("Please select a file to import.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", importFile);
    
        try {
            setLoading(true);
            const response = await axiosClient.post("/logbook-import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });
    
            message.success("Import successful!");
            setOpenImportModal(false);
            setImportFile(null);
            fetchLogBooks();  
        } catch (error) {
            console.error("Error importing logbook data:", error.response?.data);
            message.error("Failed to import records!");
        } finally {
            setLoading(false);
        }
    };



    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const paginatedLogBooks = filteredLogBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
         
  return ( 
       <div className='p-5  '>
            <div className='mt-1 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 '>
                
                <div className="flex justify-between items-center p-2 mb-2 -mt-3       dark:bg-gray-800">
                    <h1 className="text-lg font-semibold text-gray-900 font-serif dark:text-gray-200">
                        Financial Assistance
                    </h1>
                    <div className="flex space-x-2 -mt-1">
                        <button onClick={handleExport} className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                            <FiDownload className="text-lg" />
                            Export
                        </button>
                        <button onClick={() => {   setOpenImportModal(true); }} className="font-serif flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                            <FiUpload className="text-lg" />
                            Import
                        </button>
                        <button onClick={() => handleOpenCreateModal(true)} type='button' className="font-serif flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                            <FiPlus className="text-lg" />
                            Add  
                        </button>
                    </div>
                </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>

                
                <div className='grid grid-cols-10 mt-6 mb-2 gap-4 '> 
                    <div className='col-span-7'> 
                        <select name="purpose" value={selectedPurpose}  onChange={handlePurposeChange}   className='h-9 font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                            <option value="" className='font-serif'>All</option>
                            <option value="cash_assistance" className='font-serif '>Cash Assistance</option>
                            <option value="medical_assistance" className='font-serif '>Medical Assistance</option>
                            <option value="burial_assistance" className='font-serif '>Burial Assistance</option>
                        </select>
                    </div>
                    <div className="relative col-span-3 flex items-end">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-6">
                            <svg className="mb-5 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" value={searchTerm} onChange={handleSearchChange}   className="font-serif block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
                    </div>
                </div>

                <div className="h-[21rem] mt-5">  
                    <div className="max-h-[18rem] overflow-y-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 ">
                        <table className="w-full">
                            <thead className="text-gray-800 sticky -top-1 bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Date</th>
                                    <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Clients Name</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Gender</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Address</th> 
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Purpose</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Beneficiary</th>
                                    {/* <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Institution</th> */}
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Amount</th> 
                                    <th className="font-serif w-32 p-3 text-sm font-semibold tracking-wide text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center text-blue-500 dark:text-gray-400 py-4">
                                            <p className="flex justify-center text-blue-500"><BeatLoader size={12} /></p>
                                        </td>
                                    </tr>
                                ) : paginatedLogBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="font-serif text-center text-gray-500 dark:text-gray-400 py-4">
                                            No data found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedLogBooks.map((log) => (
                                        <tr key={log.id} className="bg-white dark:bg-gray-800 ">
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap ">
                                                <a href="#" className="font-serif font-bold text-blue-500 hover:underline ">{log.date}</a>
                                            </td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.client_name}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">
                                                <span className="font-serif p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50 dark:text-gray-200 dark:bg-green-600">
                                                    {log.gender}
                                                </span>
                                            </td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200 ">{log.address}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.purpose === "educational" ? "Educational Assist.." :log.purpose === "cash_assistance" ? "Cash Assist.." : log.purpose === "medical_assistance" ? "Medical Assist.." : log.purpose === "burial_assistance" ? "Burial Assist.."     : "Unknown"}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.beneficiary === "himself" ? "Himself" : log.beneficiary === "herself" ? "Herself" : log.beneficiary === "parent" ? "Parent"     : "Unknown"}</td>
                                            {/* <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.hospital_or_institutional === "cash_assistance" ? "Cash Assist.." : log.hospital_or_institutional === "polimedic" ? "Polimedic" : log.hospital_or_institutional === "ace" ? "Ace Hospital" : log.hospital_or_institutional === "sabal" ? "Sabal Hospital" : log.hospital_or_institutional === "maria_reyna" ? "Maria Reyna" : "Unknown"}</td> */}
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">₱{formatNumber(Number(log.amount).toFixed(2))}</td>
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                <button onClick={() => handleViewClick(log)} className="bg-white px-3 py-1 border rounded-md text-blue-500 hover:text-blue-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaEye /></button>
                                                <button onClick={() => handleEditClick(log)} className="bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
                                            </td>   
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div> 
                        <div className="flex justify-end mt-4">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredLogBooks.length}
                                onChange={handlePageChange}
                                showSizeChanger
                                pageSizeOptions={['5', '10', '20', '100', '150', '200']}
                            />
                        </div>
                </div>
 
                <Modal show={openCreateModal}   onClose={() => setOpenCreateModal(false)} popup>
                    <Modal.Header className='m-3'> <h1 className='font-serif'>Add New Record</h1> </Modal.Header>
                    <hr className="  -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '100%' }} />
                    <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-2 gap-5'>
                            <div>
                                <label htmlFor="date" className="font-serif mt-2 block  text-md font-medium text-gray-900 dark:text-white">Date</label>
                                <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" className='font-serif bg-gray-50 h-9 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' required/>
                            </div>
                            <div>
                                <label htmlFor="age" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Age</label>
                                <input type="number" name="age" value={formData.age}  onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-5'>
                            <div>
                                <label htmlFor="client_name" className="font-serif mt-4 block mb-1  text-md font-medium text-gray-900 dark:text-white">Clients Name</label>
                                <input type="text" name="client_name" value={formData.client_name}  onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className="font-serif mt-4 block mb-1  text-md font-medium text-gray-900 dark:text-white">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-5'> 
                            <div>
                                <label htmlFor="address" className="font-serif mt-4 block mb-1 text-md font-medium text-gray-900 dark:text-white">Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange}  className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="......" required />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'> 
                            <div>
                                <label htmlFor="purpose" className="font-serif mt-2 block mb-2 text-md font-medium text-gray-900 dark:text-white">Purpose</label>
                                <select name="purpose" value={formData.purpose} onChange={handleChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="" className='font-serif '>Select Purpose</option>
                                    <option value="educational" className='font-serif '>Educational Assistance</option>
                                    <option value="cash_assistance" className='font-serif '>Cash Assistance</option>
                                    <option value="medical_assistance" className='font-serif '>Medical Assistance</option>
                                    <option value="burial_assistance" className='font-serif '>Burial Assistance</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="beneficiary" className="font-serif mt-2 block mb-2 text-md font-medium text-gray-900 dark:text-white">Beneficiary</label>
                                <select name="beneficiary" value={formData.beneficiary} onChange={handleChange}  className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="" className='font-serif '>Select Beneficiary</option>
                                    <option value="himself" className='font-serif '>Himself</option>
                                    <option value="herself" className='font-serif '>Herself</option>
                                    <option value="parent" className='font-serif '>Parent</option> 
                                </select>
                            </div>
                            <div>
                                <label htmlFor="hospital_or_institution" className="font-serif mt-2 block mb-2 text-md font-medium text-gray-900 dark:text-white">Hospital/Institutional</label>
                                <select name="hospital_or_institutional" value={formData.hospital_or_institutional} onChange={handleChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="" >Select Hospital/Institution</option>
                                    <option value="cash_assistance" >Cash Assitance</option>
                                    <option value="polimedic" >Polimedic</option>
                                    <option value="ace" >Ace</option>
                                    <option value="sabal" >Sabal</option> 
                                    <option value="maria_reyna" >Maria Reyna</option> 
                                </select>
                            </div>
                            <div>
                                <label htmlFor="contact_number" className="font-serif mt-2 block mb-2 text-md font-medium text-gray-900 dark:text-white">Contact #</label>
                                <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="......" required />
                            </div>
                            <div>
                                <label htmlFor="amount" className="font-serif mt-2 block mb-2 text-md font-medium text-gray-900 dark:text-white">Amount</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="......" required />
                            </div>
                            {/* <div className="flex flex-col items-center gap-3 p-4 border rounded-lg shadow-md">
                                {preview && (
                                    <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-md border"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file:border file:py-2 file:px-4 file:rounded-lg file:bg-blue-500 file:text-white file:cursor-pointer"
                                />
                            </div> */}
                        </div>
                        <div className='flex justify-center'>
                            {/* <button type="submit" className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4'  >  Create </button> */}
                            <button type="submit" disabled={loading}  className={`font-serif text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                  
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

                <Modal show={openViewModal} size='sm' onClose={() => setOpenViewModal(false)}>
                    <Modal.Header>
                        <h1 className='font-serif'>Resident Details</h1>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedResident && (
                            <div>
                                <p className='font-serif'><strong className='font-serif'>Date: </strong> {selectedResident.date}</p>
                                <p className='font-serif'><strong className='font-serif'>Name: </strong> {selectedResident.client_name}</p>
                                <p className='font-serif'><strong className='font-serif'>Age:</strong> {selectedResident.age}</p>
                                <p className='font-serif'><strong className='font-serif'>Gender:</strong> {selectedResident.gender}</p>
                                <p className='font-serif'><strong className='font-serif'>Address:</strong> {selectedResident.address}</p>
                                <p className='font-serif'><strong className='font-serif'>Purpose:</strong> {selectedResident.purpose === "educational" ? "Educational Assistance" : selectedResident.purpose === "cash_assistance" ? "Cash Assistance" : selectedResident.purpose === "medical_assistance" ? "Medical Assistance" : selectedResident.purpose === "burial_assistance" ? "Burial Assistance"     : "Unknown"}</p>
                                <p className='font-serif'><strong className='font-serif'>Beneficiary:</strong> {selectedResident.beneficiary === "himself" ? "Himself" : selectedResident.beneficiary === "herself" ? "Herself" : selectedResident.beneficiary === "parent" ? "Parent"     : "Unknown"}</p>
                                <p className='font-serif'><strong className='font-serif'>Institution:</strong> {selectedResident.hospital_or_institutional === "cash_assistance" ? "Assistance" : selectedResident.hospital_or_institutional === "polimedic" ? "Polimedic" : selectedResident.hospital_or_institutional === "ace" ? "Ace Hospital" : selectedResident.hospital_or_institutional === "sabal" ? "Sabal Hospital" : selectedResident.hospital_or_institutional === "maria_reyna" ? "Maria Reyna" : "Unknown"}</p>
                                <p className='font-serif'><strong className='font-serif'>Contact Number:</strong> {selectedResident.contact_number}</p>
                                <p className='font-serif'><strong className='font-serif'>Amount:</strong> ₱{selectedResident.amount}</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setOpenViewModal(false)} className="font-serif  ">
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
                    <Modal.Header><h1 className='font-serif'>Edit Logbook Entry</h1></Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-serif">Client Name</label>
                                    <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block font-serif">Age</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block font-serif">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-serif">Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block font-serif">Purpose</label>
                                    <select name="purpose" value={formData.purpose} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="educational" className='font-serif '>Educational Assistance</option>
                                        <option value="cash_assistance" className='font-serif '>Cash Assistance</option>
                                        <option value="medical_assistance" className='font-serif '>Medical Assistance</option>
                                        <option value="burial_assistance" className='font-serif '>Burial Assistance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-serif">Beneficiary</label>
                                    <select name="beneficiary" value={formData.beneficiary} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="himself" className='font-serif '>Himself</option>
                                        <option value="herself" className='font-serif '>Herlself</option>
                                        <option value="parent" className='font-serif '>Parent</option> 
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-serif">Institution</label>
                                    <select name="hospital_or_institution" value={formData.hospital_or_institutional} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="cash_assistance" >Cash Assitance</option>
                                        <option value="polimedic" >Polimedic</option>
                                        <option value="ace" >Ace</option>
                                        <option value="sabal" >Sabal</option> 
                                        <option value="maria_reyna" >Maria Reyna</option> 
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-serif">Contact #</label>
                                    <input type="number" name="contact_number" value={formData.contact_number} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block font-serif">Amount</label>
                                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="button" onClick={() => setOpenEditModal(false)} className="font-serif text-white bg-gradient-to-br from-red-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4">
                                    Cancel
                                </button> 
                                <button type="submit" disabled={loading}  className={`font-serif text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                  
                                    {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                                    </svg>
                                    ) : (
                                    <> 
                                        Update
                                    </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal> 

                <Modal show={openImportModal} size='md'  onClose={() => setOpenImportModal(false)}>
                    <Modal.Header >
                        <h1 className='font-serif'>Import Financian Assistance Datas</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="flex flex-col space-y-4">
                            <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} className="border p-2 rounded" />
                            <button 
                                onClick={handleImport} 
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                            >
                                Import File
                            </button>
                        </div>
                    </Modal.Body>

                </Modal>
            </div>
       </div>
     
  )
}

export default Record_List