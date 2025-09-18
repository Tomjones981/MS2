import React, { useState, useEffect } from 'react'
import { BeatLoader } from 'react-spinners'  
import { DatePicker, Space } from 'antd';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Button, Modal } from 'flowbite-react'; 
import {  message, Pagination } from 'antd'; 
import { FaEye, FaRegEdit } from "react-icons/fa";
import { FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import axiosClient from '../../../../api/axiosClient'
import Financial_Assistance from '../Reports/Endorsement/Financial_Assistance'
 
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
    const [pageSize, setPageSize] = useState(10);
    const paginatedLogBooks = filteredLogBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const [openReportModal, setOpenReportModal] = useState(false);
         

    // const handlePrint = () => {
    //     const printableArea = document.getElementById("printable-area");
    
    //     if (!printableArea) {
    //         console.error("Printable area not found!");   
    //         return;
    //     }
    
    //     const printContent = printableArea.innerHTML;
    //     const originalContent = document.body.innerHTML;
    
    //     document.body.innerHTML = printContent;
    //     window.print();
    //     document.body.innerHTML = originalContent;
    // };
  return ( 
       <div className='p-5  '>
            <div className='mt-1 w-full p-5 bg-white border border-gray-200 rounded-lg  dark:bg-gray-800 dark:border-gray-700 '>
                
                <div className="flex justify-between items-center p-2 mb-2 -mt-3       dark:bg-gray-800">
                    <h1 className="text-lg font-light text-gray-900  dark:text-gray-200">
                        Financial Assistance
                    </h1>
                    <div className=" font-light flex space-x-2 -mt-1">
                        {/* <button  type='button' onClick={handlePrint}  className=" flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg -md hover:bg-blue-700 transition">
                            Print
                        </button> */}
                        <button  type='button' onClick={() => setOpenReportModal(true)}  className=" flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg -md hover:bg-blue-700 transition">
                            Reports
                        </button>
                        <button onClick={handleExport} className=" flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg -md hover:bg-blue-700 transition">
                            <FiDownload className="text-lg" />
                            Export
                        </button>
                        <button onClick={() => {   setOpenImportModal(true); }} className=" flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg -md hover:bg-indigo-700 transition">
                            <FiUpload className="text-lg" />
                            Import
                        </button>
                        <button onClick={() => handleOpenCreateModal(true)} type='button' className=" flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg -md hover:bg-green-700 transition">
                            <FiPlus className="text-lg" />
                            Add  
                        </button>
                    </div>
                </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>

                
                <div className='grid grid-cols-10 mt-6 mb-2 gap-4 '> 
                    <div className='col-span-7'> 
                        <select name="purpose" value={selectedPurpose}  onChange={handlePurposeChange}   className='h-9   bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                            <option value="" className=' font-light'>All</option>
                            <option value="cash_assistance" className='  font-light'>Cash Assistance</option>
                            <option value="medical_assistance" className='  font-light'>Medical Assistance</option>
                            <option value="burial_assistance" className='  font-light'>Burial Assistance</option>
                        </select>
                    </div>
                    <div className=" font-light relative col-span-3 flex items-end">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-6">
                            <svg className="mb-5 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" value={searchTerm} onChange={handleSearchChange}   className=" block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
                    </div>
                </div>

                <div id="printable-area" className="h-[40rem] mt-5">  
                    <div className="max-h-[37rem] overflow-y-auto rounded-lg  border border-gray-200 dark:border-gray-700 ">
                        <table className="w-full">
                            <thead className="text-gray-800 sticky -top-1 bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    {["Date", "Client's Name", "Gender", "Address", "Purpose", "Beneficiary", "Amount", "Actions"].map((header, index) => (
                                        <th key={index} className="w-24 p-3 text-sm font-light tracking-wide text-left">
                                            <div className="flex items-center">
                                                <p>{header}</p>
                                                {header !== "Actions" && (
                                                    <a href="#" className="ml-1">
                                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </th>
                                    ))}
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
                                        <td colSpan="9" className=" text-center text-gray-500 dark:text-gray-400 py-4">
                                            No data found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedLogBooks.map((log) => (
                                        <tr key={log.id} className="bg-white dark:bg-gray-800 ">
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap ">
                                                <a href="#" className=" font-normal text-blue-500 hover:underline ">{log.date}</a>
                                            </td>
                                            <td className=" p-3 font-light text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.client_name}</td>
                                            <td className=" p-3 text-sm text-gray-700 whitespace-nowrap">
                                                <span className=" p-1.5 text-xs font-normal uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50 dark:text-gray-200 dark:bg-green-600">
                                                    {log.gender}
                                                </span>
                                            </td>
                                            <td className=" p-3 font-light text-sm text-gray-700 whitespace-nowrap dark:text-gray-200 ">{log.address}</td>
                                            <td className=" p-3 font-light text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.purpose === "educational" ? "Educational Assist.." :log.purpose === "cash_assistance" ? "Cash Assist.." : log.purpose === "medical_assistance" ? "Medical Assist.." : log.purpose === "burial_assistance" ? "Burial Assist.."     : "Unknown"}</td>
                                            <td className=" p-3 font-light text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.beneficiary === "himself" ? "Himself" : log.beneficiary === "herself" ? "Herself" : log.beneficiary === "parent" ? "Parent"     : "Unknown"}</td>
                                            {/* <td className=" p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{log.hospital_or_institutional === "cash_assistance" ? "Cash Assist..": log.hospital_or_institutional === "dswd" ? "DSWD"  : log.hospital_or_institutional === "polimedic" ? "Polimedic" : log.hospital_or_institutional === "ace" ? "Ace Hospital" : log.hospital_or_institutional === "sabal" ? "Sabal Hospital" : log.hospital_or_institutional === "maria_reyna" ? "Maria Reyna" : "Unknown"}</td> */}
                                            <td className=" p-3 font-light text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">₱{formatNumber(Number(log.amount).toFixed(2))}</td>
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                <button onClick={() => handleViewClick(log)} className="bg-white px-3 py-1 border rounded-md text-blue-500 hover:text-blue-700 dark:bg-gray-800   hover:scale-110 transition-all duration-300"><FaEye /></button>
                                                <button onClick={() => handleEditClick(log)} className="bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 dark:bg-gray-800  hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
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
                                pageSizeOptions={[ '5', '10', '20', '100', '150', '200', '250', '500']}
                            />
                        </div>
                </div>
 
                <Modal show={openCreateModal} size='5xl'  onClose={() => setOpenCreateModal(false)} popup>
                    <Modal.Header className='m-3 '> <h1 className='font-light'>Add New Record</h1> </Modal.Header>
                    <hr className="  -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '100%' }} />
                    <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-2 gap-5'>
                            <div>
                                <label htmlFor="date" className=" mt-2 block  text-md font-light text-gray-900 dark:text-white">Date</label>
                                <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" className='w-full  bg-gray-50 h-9 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' required/>
                            </div>
                            <div>
                                <label htmlFor="age" className=" mt-2 block mb-1  text-md font-light text-gray-900 dark:text-white">Age</label>
                                <input type="number" name="age" value={formData.age}  onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-5'>
                            <div>
                                <label htmlFor="client_name" className=" mt-4 block mb-1  text-md font-light text-gray-900 dark:text-white">Clients Name</label>
                                <input type="text" name="client_name" value={formData.client_name}  onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className=" mt-4 block mb-1  text-md font-light text-gray-900 dark:text-white">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className='font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="" className='font-light'>Select Gender</option>
                                    <option value="male" className='font-light'>Male</option>
                                    <option value="female" className='font-light'>Female</option>
                                    <option value="other" className='font-light'>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-5'> 
                            <div>
                                <label htmlFor="address" className=" mt-4 block mb-1 text-md font-light text-gray-900 dark:text-white">Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange}  className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="......" required />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'> 
                            <div>
                                <label htmlFor="purpose" className=" mt-2 block mb-2 text-md font-light text-gray-900 dark:text-white">Purpose</label>
                                <select name="purpose" value={formData.purpose} onChange={handleChange} className='font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="" className='font-light '>Select Purpose</option>
                                    <option value="educational" className=' font-light'>Educational Assistance</option>
                                    <option value="cash_assistance" className=' font-light'>Cash Assistance</option>
                                    <option value="medical_assistance" className='font-light '>Medical Assistance</option>
                                    <option value="burial_assistance" className='font-light '>Burial Assistance</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="beneficiary" className=" mt-2 block mb-2 text-md font-light text-gray-900 dark:text-white">Beneficiary</label>
                                <select name="beneficiary" value={formData.beneficiary} onChange={handleChange}  className='font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="" className='font-light '>Select Beneficiary</option>
                                    <option value="himself" className=' font-light'>Himself</option>
                                    <option value="herself" className='font-light '>Herself</option>
                                    <option value="parent" className=' font-light'>Parent</option> 
                                </select>
                            </div>
                            <div>
                                <label htmlFor="hospital_or_institution" className=" mt-2 block mb-2 text-md font-light text-gray-900 dark:text-white">Hospital/Institutional</label>
                                <select name="hospital_or_institutional" value={formData.hospital_or_institutional} onChange={handleChange} className='font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                    <option value="" className='font-light'>Select Hospital/Institution</option>
                                    <option value="cash_assistance" className='font-light'>Cash Assitance</option>
                                    <option value="dswd"  className='font-light'>DSWD</option>
                                    <option value="ace" className='font-light'>Ace</option>
                                    <option value="sabal" className='font-light'>Sabal</option> 
                                    <option value="polimedic" className='font-light'>Polimedic</option>
                                    <option value="maria_reyna" className='font-light'>Maria Reyna</option> 
                                </select>
                            </div>
                            <div>
                                <label htmlFor="contact_number" className=" mt-2 block mb-2 text-md font-light text-gray-900 dark:text-white">Contact #</label>
                                <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange}  className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="......" required />
                            </div>
                        </div>
                            <div>
                                <label htmlFor="amount" className=" mt-2 block mb-2 text-md font-light text-gray-900 dark:text-white">Amount</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="......" required />
                            </div>  
                        <div className='mt-4 flex justify-end'>
                            <button type="button" onClick={() => setOpenEditModal(false)} className="font-light text-white bg-gradient-to-br from-red-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-light rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4">
                                    Cancel
                                </button> 
                            {/* <button type="submit" className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-light rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4'  >  Create </button> */}
                            <button type="submit" disabled={loading}  className={` text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-light rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                  
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

                <Modal show={openViewModal} size='2xl' onClose={() => setOpenViewModal(false)}>
                    <Modal.Header>
                        <h1 className=' text-lg font-light text-gray-800 dark:text-gray-200'>Resident Details</h1>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedResident && (
                            <div className="bg-gray-100 rounded-lg p-6 -md dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                <div className="flex flex-col gap-4">
                                     
                                    <div className="border-b pb-2 dark:border-gray-500">
                                        <p className="font-light text-sm text-gray-600 dark:text-gray-200">Date</p>
                                        <p className=" font-normal text-gray-800 dark:text-gray-200">{selectedResident.date}</p>
                                    </div>

                                     
                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-light text-sm text-gray-600 dark:text-gray-200">Name</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">{selectedResident.client_name}</p>
                                        </div>
                                        <div>
                                            <p className="font-light text-sm text-gray-600 dark:text-gray-200">Age</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">{selectedResident.age}</p>
                                        </div>
                                    </div>

                                     
                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-light text-sm text-gray-600 dark:text-gray-200">Gender</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">
                                            {selectedResident.gender === "male" ? "Male" :
                                                selectedResident.gender === "female" ? "Female" : 
                                                "Unknown"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className=" font-light text-sm text-gray-600 dark:text-gray-200">Address</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">{selectedResident.address}</p>
                                        </div>
                                    </div>

                                     
                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-light text-sm text-gray-600 dark:text-gray-200">Purpose</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">
                                                {selectedResident.purpose === "educational" ? "Educational Assistance" :
                                                selectedResident.purpose === "cash_assistance" ? "Cash Assistance" :
                                                selectedResident.purpose === "medical_assistance" ? "Medical Assistance" :
                                                selectedResident.purpose === "burial_assistance" ? "Burial Assistance" :
                                                "Unknown"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-light text-sm text-gray-600 dark:text-gray-200">Beneficiary</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">
                                                {selectedResident.beneficiary === "himself" ? "Himself" :
                                                selectedResident.beneficiary === "herself" ? "Herself" :
                                                selectedResident.beneficiary === "parent" ? "Parent" :
                                                "Unknown"}
                                            </p>
                                        </div>
                                    </div>

                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-light text-sm text-gray-600 dark:text-gray-200">Institution</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">
                                                {selectedResident.hospital_or_institutional === "cash_assistance" ? "Cash Assistance" :
                                                selectedResident.hospital_or_institutional === "dswd" ? "DSWD" :
                                                selectedResident.hospital_or_institutional === "polimedic" ? "Polimedic" :
                                                selectedResident.hospital_or_institutional === "ace" ? "Ace Hospital" :
                                                selectedResident.hospital_or_institutional === "sabal" ? "Sabal Hospital" :
                                                selectedResident.hospital_or_institutional === "maria_reyna" ? "Maria Reyna" :
                                                "Unknown"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-light text-sm text-gray-600 dark:text-gray-200">Contact Number</p>
                                            <p className=" font-normal text-gray-800 dark:text-gray-200">{selectedResident.contact_number}</p>
                                        </div>
                                    </div>

                                     
                                    <div className="border-t pt-2 dark:border-gray-500 ">
                                        <p className=" font-light text-sm text-gray-600 dark:text-gray-200">Amount</p>
                                        <p className=" font-normal text-gray-800 dark:text-gray-200">₱{selectedResident.amount}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                        <Modal.Footer className='flex justify-end'>
                            <Button  onClick={() => setOpenViewModal(false)}  className="font-light   bg-red-600 text-white rounded-md hover:bg-red-700 transition-all dark:bg-red-500" >
                                Close
                            </Button>
                            <Button onClick={() => handleEditClick(selectedResident)} className="font-light     text-white rounded-md   transition-all  ">
                                Edit
                            </Button>
                    </Modal.Footer>
                    
                </Modal>


                <Modal show={openEditModal} size='5xl'  onClose={() => setOpenEditModal(false)}>
                    <Modal.Header><h1 className='font-light'>Edit Logbook Entry</h1></Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-light">Client Name</label>
                                    <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block font-light">Age</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block font-light">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="male" className='font-light'>Male</option>
                                        <option value="female" className='font-light'>Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-light">Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block font-light">Purpose</label>
                                    <select name="purpose" value={formData.purpose} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="educational" className=' font-light'>Educational Assistance</option>
                                        <option value="cash_assistance" className='font-light '>Cash Assistance</option>
                                        <option value="medical_assistance" className=' font-light'>Medical Assistance</option>
                                        <option value="burial_assistance" className=' font-light'>Burial Assistance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-light">Beneficiary</label>
                                    <select name="beneficiary" value={formData.beneficiary} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="himself" className='font-light '>Himself</option>
                                        <option value="herself" className='font-light '>Herlself</option>
                                        <option value="parent" className=' font-light'>Parent</option> 
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-light">Institution</label>
                                    <select name="hospital_or_institutional" value={formData.hospital_or_institutional} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                        <option value="cash_assistance" className='font-light'>Cash Assitance</option>
                                        <option value="dswd" className='font-light'>DSWD</option>
                                        <option value="ace" className='font-light'>Ace</option>
                                        <option value="sabal" className='font-light'>Sabal</option> 
                                        <option value="polimedic" className='font-light'>Polimedic</option>
                                        <option value="maria_reyna" className='font-light'>Maria Reyna</option> 
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-light">Contact #</label>
                                    <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                                <div>
                                    <label className="block font-light">Amount</label>
                                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="button" onClick={() => setOpenEditModal(false)} className="font-light text-white bg-gradient-to-br from-red-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-light rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4">
                                    Cancel
                                </button> 
                                <button type="submit" disabled={loading}  className={`font-light text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-light rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                  
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
                        <h1 className='font-light'>Import Financian Assistance File</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="flex flex-col space-y-4">
                            <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} className="font-light border p-2 rounded" />
                            
                            <div className='flex justify-center'>
                                <button onClick={handleImport}  disabled={loading}  className={`font-light text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                        
                                    {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                                    </svg>
                                    ) : (
                                    <> 
                                        Import File
                                    </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </Modal.Body>

                </Modal>

                <Modal show={openReportModal} size='2xl'  onClose={() => setOpenReportModal(false)}>
                    <Modal.Header>
                        <h1 className='font-light'>Reports</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <Financial_Assistance/>
                    </Modal.Body>
                </Modal>
            </div>
       </div>
     
  )
}

export default Record_List