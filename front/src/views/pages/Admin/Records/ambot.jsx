import React, { useState, useEffect } from 'react'
import { BeatLoader } from 'react-spinners' 
import { Pagination } from 'antd';   
import { DatePicker, Space } from 'antd';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Modal } from 'flowbite-react'; 
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
            alert("Record added successfully!");
            setOpenCreateModal(false);  
            setFormData({  
                date: "",
                client_name: "",
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
            alert("Failed to create record!");
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
            setSelectedLog(record); // Ensure selectedLog is updated instead of selectedResident
            setFormData({
                date: record.date || "",
                client_name: record.client_name || "",
                gender: record.gender || "",
                address: record.address || "",
                purpose: record.purpose || "",
                beneficiary: record.beneficiary || "",
                hospital_or_institutional: record.hospital_or_institutional || "",
                contact_number: record.contact_number || "",
                amount: record.amount || ""
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
        
                console.log("Logbook record updated:", response.data);
                alert("Record updated successfully!");
                setOpenEditModal(false);
                fetchLogBooks(); // Refresh the list
            } catch (error) {
                console.error("Error updating logbook record:", error.response?.data);
                alert("Failed to update record!");
            } finally {
                setLoading(false);
            }
        };
        
        
         
        
        
  return ( 
       <div className='p-5  '>
            <div className='mt-1 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 '>
                
            <div className="flex justify-between items-center p-2 mb-2 -mt-3       dark:bg-gray-800">
                <h1 className="text-lg font-semibold text-gray-900 font-serif dark:text-gray-200">
                    Logbook Entries
                </h1>
                <div className="flex space-x-2 -mt-1">
                    <button className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                        <FiDownload className="text-lg" />
                        Export
                    </button>
                    <button className="font-serif flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                        <FiUpload className="text-lg" />
                        Import
                    </button>
                    <button onClick={() => setOpenCreateModal(true)} type='button' className="font-serif flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                        <FiPlus className="text-lg" />
                        Add  
                    </button>
                </div>
            </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>

                
                <div className='grid grid-cols-10 mt-6 mb-2 gap-4 '> 
                    <div className='col-span-7'> 
                        <select name="purpose" value={selectedPurpose}  onChange={handlePurposeChange}   className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                            <option value="" className='font-serif '>All</option>
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
                        <input type="search" value={searchTerm} onChange={handleSearchChange}   className="font-serif block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
                    </div>
                </div>

                <div className="h-screen mt-5">  
                    <div className="overflow-auto rounded-lg shadow    ">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200">
                                <tr>
                                    <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Date</th>
                                    <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Clients Name</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Gender</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Address</th> 
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Purpose</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Beneficiary</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Institution</th>
                                    <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Amount</th> 
                                    <th className="font-serif w-32 p-3 text-sm font-semibold tracking-wide text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:bg-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center text-gray-500 dark:text-gray-400 py-4">
                                            <p className="flex justify-center text-blue-500"><BeatLoader size={12} /></p>
                                        </td>
                                    </tr>
                                ) : filteredLogBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="font-serif text-center text-gray-500 dark:text-gray-400 py-4">
                                            No data found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogBooks.map((log) => (
                                        <tr key={log.id} className="bg-white">
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                                                <a href="#" className="font-serif font-bold text-blue-500 hover:underline">{log.date}</a>
                                            </td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">{log.client_name}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">
                                                <span className="font-serif p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                                                    {log.gender}
                                                </span>
                                            </td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">{log.address}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">{log.purpose === "cash_assistance" ? "Cash Assist.." : log.purpose === "medical_assistance" ? "Medical Assist.." : log.purpose === "burial_assistance" ? "Burial Assist.."     : "Unknown"}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">{log.beneficiary === "himself" ? "Himself" : log.beneficiary === "herself" ? "Herself" : log.beneficiary === "parent" ? "Parent"     : "Unknown"}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">{log.hospital_or_institutional === "cash_assistance" ? "Cash Assist.." : log.hospital_or_institutional === "polimedic" ? "Polimedic" : log.hospital_or_institutional === "ace" ? "Ace Hospital" : log.hospital_or_institutional === "sabal" ? "Sabal Hospital" : log.hospital_or_institutional === "maria_reyna" ? "Maria Reyna" : "Unknown"}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">₱{formatNumber(Number(log.amount).toFixed(2))}</td>
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                <button onClick={() => handleViewClick(log)} className="text-blue-500 hover:text-blue-700"><FaEye /></button>
                                                <button onClick={() => handleEditClick(resident)} className="text-green-500 hover:text-green-700"><FaRegEdit /></button>
                                            </td>   
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div> 
                </div>
 
                <Modal show={openCreateModal}   onClose={() => setOpenCreateModal(false)} popup>
                    <Modal.Header className='m-3'> Add New Record </Modal.Header>
                    <hr className="  -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '100%' }} />
                    <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 gap-5'>
                            <div>
                                <label htmlFor="date" className="font-serif mt-2 block  text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" className='font-serif bg-gray-50 h-10 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'/>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-5'>
                            <div>
                                <label htmlFor="client_name" className="font-serif mt-4 block mb-1  text-sm font-medium text-gray-900 dark:text-white">Clients Name</label>
                                <input type="text" name="client_name" value={formData.client_name}  onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......" required />
                            </div>
                            <div>
                                <label htmlFor="gender" className="font-serif mt-4 block mb-1  text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-5'> 
                            <div>
                                <label htmlFor="address" className="font-serif mt-4 block mb-1 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange}  className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Address" required />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'> 
                            <div>
                                <label htmlFor="purpose" className="font-serif mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Purpose</label>
                                <select name="purpose" value={formData.purpose} onChange={handleChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                    <option value="" className='font-serif '>Select Purpose</option>
                                    <option value="cash_assistance" className='font-serif '>Cash Assistance</option>
                                    <option value="medical_assistance" className='font-serif '>Medical Assistance</option>
                                    <option value="burial_assistance" className='font-serif '>Burial Assistance</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="beneficiary" className="font-serif mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Beneficiary</label>
                                <select name="beneficiary" value={formData.beneficiary} onChange={handleChange}  className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                    <option value="" className='font-serif '>Select Beneficiary</option>
                                    <option value="himself" className='font-serif '>Himself</option>
                                    <option value="herself" className='font-serif '>Herlself</option>
                                    <option value="parent" className='font-serif '>Parent</option> 
                                </select>
                            </div>
                            <div>
                                <label htmlFor="hospital_or_institution" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hospital/Institutional</label>
                                <select name="hospital_or_institutional" value={formData.hospital_or_institutional} onChange={handleChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                    <option value="" >Select Hospital/Institution</option>
                                    <option value="cash_assistance" >Cash Assitance</option>
                                    <option value="polimedic" >Polimedic</option>
                                    <option value="ace" >Ace</option>
                                    <option value="sabal" >Sabal</option> 
                                    <option value="maria_reyna" >Maria Reyna</option> 
                                </select>
                            </div>
                            <div>
                                <label htmlFor="contact_number" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact #</label>
                                <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contact Number" required />
                            </div>
                            <div>
                                <label htmlFor="amount" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Amount" required />
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
                            <button type="submit" className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4'  >  Create </button>
                        </div>
                    </form>
                    </Modal.Body>
                </Modal>

                <Modal show={openViewModal} onClose={() => setOpenViewModal(false)}>
                    <Modal.Header>
                        Resident Details
                    </Modal.Header>
                    <Modal.Body>
                        {selectedResident && (
                            <div>
                                <p><strong>Name:</strong> {selectedResident.client_name}</p>
                                <p><strong>Contact Number:</strong> {selectedResident.contact_number}</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => setOpenViewModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
                    <Modal.Header>Edit Logbook Entry</Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleUpdate}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-serif">Client Name</label>
                                    <input 
                                        type="text" 
                                        name="client_name" 
                                        value={formData.client_name} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block font-serif">Gender</label>
                                    <select 
                                        name="gender" 
                                        value={formData.gender} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-serif">Address</label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block font-serif">Amount</label>
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        value={formData.amount} 
                                        onChange={handleChange} 
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="button" onClick={() => setOpenEditModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded ml-2">
                                    Update
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>



            </div>
       </div>
     
  )
}

export default Record_List