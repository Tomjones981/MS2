 
import React, { useEffect, useState } from 'react';
import { FiMoreVertical, FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import axiosClient from '../../../../api/axiosClient';
import { FaEye, FaRegEdit } from "react-icons/fa";
import { Button, Modal } from 'flowbite-react';
import { DatePicker, message, Pagination } from 'antd';
import { IoArrowBackOutline } from "react-icons/io5";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

const Opol_ECCD = () => {
    const { SubCatId } = useParams();
    const navigate = useNavigate();
    
    const [subCatInfo, setSubCatInfo] = useState({
        sub_cat_name: "",
        age_range: "",
        description: ""
    });

    const [eccdInfo, setEccdInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [openCreateModal, setOpenCreateModal] = useState(false); 
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openViewReportModal, setOpenViewReportModal] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    
    const [formData, setFormData] = useState({
        sub_cat_id: '',
        children_name: '',
        age: '',
        sex: '',
        yes: '',
        no: '', 
        school_name: '', 
        barangay: '', 
        school_address: '', 
        remarks: '', 
    });

    useEffect(() => {
        if (SubCatId) {
            fetchsubCatNames(SubCatId);
            fetchEccdInfo(SubCatId);
        }
    }, [SubCatId]);

    const fetchEccdInfo = async (SubCatId) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/sub-category/personal-info/${SubCatId}`);
            setEccdInfo(response.data || []);
        } catch (error) {
            console.error("Error fetching Cdc Info:", error);
            message.error("Failed to fetch Cdc info.");
        } finally {
            setLoading(false);
        }
    };

    const fetchsubCatNames = async (SubCatId) => {
        try {
            const response = await axiosClient.get(`/brgy-sectors/sub-category/sub-cat-name/${SubCatId}`);
            setSubCatInfo(response.data);
        } catch (error) {
            console.error("Error fetching sub category details:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenCreateModal = () => {
        setFormData({
            sub_cat_id: '',
            children_name: '',
            age: '',
            sex: '',
            yes: '',
            no: '', 
            school_name: '', 
            barangay: '', 
            school_address: '', 
            remarks: '', 
        });
        setOpenCreateModal(true);
    };
    
    
    const handleDateChange = (date, dateString) => {
        setFormData({ ...formData, birthday: dateString });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,  
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
    
        try {
            const response = await axiosClient.post('/opol-eccd-create', {
                sub_cat_id: SubCatId, 
                children_name: formData.children_name,
                age: formData.age,
                sex: formData.sex,
                yes: formData.yes,
                no: formData.no, 
                school_name: formData.school_name, 
                barangay: formData.barangay, 
                school_address: formData.school_address, 
                remarks: formData.remarks, 
            });
    
            message.success("Successfully Created");
            setOpenCreateModal(false);
            setFormData({
                sub_cat_id: '',
                children_name: '',
                age: '',
                sex: '',
                yes: '',
                no: '', 
                school_name: '', 
                barangay: '', 
                school_address: '',
                remarks: '',
            });
            fetchEccdInfo(SubCatId);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error Creating Cdc info", error);
                message.error("Error Creating Info.");
            }
        }
    };
    
    const [importFile, setImportFile] = useState(null);  
    const handleFileChange = (e) => {
        setImportFile(e.target.files[0]);
    }; 
    const handleImportSubmit = async () => {
        if (!importFile) {
            message.error("Please select a file to import.");
            return;
        }

        const formData = new FormData();
        formData.append("file", importFile);
        formData.append("sub_cat_id", SubCatId);

        try {
            setLoading(true);
            await axiosClient.post("/opol-eccd-import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            message.success("Import successful!");
            setOpenImportModal(false);
            fetchEccdInfo(SubCatId);
        } catch (error) {
            console.error("Error importing data:", error.response?.data);
            message.error("Failed to import records!");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axiosClient.get(`/opol-cdc-export-excel/${SubCatId}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'OPOL_ECCD.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Export successful!");
        } catch (error) {
            console.error("Error exporting file:", error);
            message.error("Failed to export data.");
        }
    };
    const [searchQuery, setSearchQuery] = useState("");
    const filteredEccdInfo = eccdInfo.filter(eccd => {
        const query = searchQuery.toLowerCase();
        return eccd.children_name.toLowerCase().includes(query) ||
               eccd.school_name.toLowerCase().includes(query);
    });
    

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const paginatedData = filteredEccdInfo.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
        setCurrentPage(1);
    }
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedEccdInfo, setSelectedEccdInfo] = useState(null);
    const handleViewClick = (eccdInfo) => {
        setSelectedEccdInfo(eccdInfo);
        setOpenViewModal(true); 
    }

    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const handleEditClick = (record) => {
            setSelectedLog(record);
            setFormData({ 
                    children_name: record.children_name,
                    age: record.age,
                    sex: record.sex,
                    yes: record.yes,
                    no: record.no, 
                    school_name: record.school_name, 
                    barangay: record.barangay, 
                    school_address: record.school_address, 
                    remarks: record.remarks, 
                });
                setOpenEditModal(true);
            };

             const handleUpdate = async (e) => {
                    e.preventDefault();
                    setLoading(true);
                
                    try {
                        const response = await axiosClient.put(`/opol-eccd-update/${selectedLog.id}`, {
                            ...formData,
                            sub_cat_id: SubCatId  
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("access_token")}`
                            }
                        });
                
                        message.success("Info updated successfully!");
                        setOpenEditModal(false);
                        fetchEccdInfo(SubCatId);  
                    } catch (error) {
                        console.error("Error updating ECCD info:", error.response?.data);
                        message.error("Failed to update info!");
                    } finally {
                        setLoading(false);
                    }
                }; 

    return (
        <div className='p-5'>
            <div className='mt-2 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                 
                <div className='flex justify-between items-center p-2 mb-2 -mt-3 dark:bg-gray-800'>
                    <button onClick={() => navigate(-1)} className='shadow-xl -ml-[3rem] -mr-[38rem] border border-gray-200 bg-gray-600 flex items-center gap-2 p-2 text-gray-200 rounded-md font-bold text-xl transition-all hover:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                        <ReplyAllIcon className='text-2xl  ' /> 
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 font-serif dark:text-gray-200">
                        <span className="text-blue-600 font-serif underline">
                            {/* {subCatInfo.id || "Loading..."}{" "}  */}
                            {subCatInfo.sub_cat_name || "Loading..."}{" "} 
                            {subCatInfo.age_range || "Loading..."}{" "}
                            {/* {subCatInfo.description || ""}   */}
                        </span> Category
                    </h1>
                    <div className="flex space-x-2 -mt-1"> 
                        <button onClick={() => setOpenMenu(!openMenu)} className="p-2 rounded-full bg-gray-600 text-white shadow-md hover:bg-gray-500 transition">
                            <FiMoreVertical className="text-xl" />
                        </button>

                        {openMenu && (
                            <div className=' '>
                                <div className='absolute right-[5rem] mt-10  flex gap-5 w-[30rem] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10'>
                                    <button  type='button'   className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                        Reports
                                    </button>
                                    <button  onClick={handleExport} className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                        <FiDownload className="text-lg" />
                                        Export
                                    </button>
                                    <button  type='button' onClick={() => setOpenImportModal(true)}   className="font-serif flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                                        <FiUpload className="text-lg" />
                                        Import
                                    </button>
                                    <button type='button' onClick={() => handleOpenCreateModal(true)}  className="font-serif flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                                        <FiPlus className="text-lg" />
                                        Add  
                                    </button>
                                </div>
                            </div>
                        )} 
                    </div>
                </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>
                <div className='grid grid-cols-10 mt-6 mb-2 gap-4 '> 
                    <div className='col-span-7'> 
                        <select   className='h-9 font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                            <option value="" className='font-serif'>All</option> 
                        </select>
                    </div>
                    <div className="relative col-span-3 flex items-end">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-6">
                            <svg className="mb-5 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" value={searchQuery}  onChange={(e) => setSearchQuery(e.target.value)} className="font-serif block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
                    </div>
                </div>
                <div className='h-[23rem] mt-5'>  
                        <div className="max-h-[20rem] overflow-y-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <table className="w-full">
                                <thead className='text-gray-800 sticky -top-1 bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200'>
                                    <tr className=""> 
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Children Name</th>  
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Age</th>  
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Gender</th>  
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Attending School</th> 
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Barangay</th> 
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">School Name</th> 
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">School Address</th> 
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Remarks</th>  
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Actions</th>  
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800'>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="9" className="text-center text-blue-500 dark:text-gray-400 py-4">
                                                <p className="flex justify-center text-blue-500"><BeatLoader size={12} /></p>
                                            </td>
                                        </tr>
                                        ) : paginatedData.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="font-serif text-center text-gray-500 dark:text-gray-400 py-4">
                                                    No data found
                                                </td>
                                            </tr>
                                        ) : ( 
                                        paginatedData.map((eccd) => (
                                        <tr key={eccd.id} className="bg-white dark:bg-gray-800"> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{eccd.children_name}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{eccd.age}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{eccd.sex}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{eccd.yes === '/' || !eccd.no ? 'Yes' : eccd.no === '/' || !eccd.yes ? 'No' : ''}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{eccd.school_name}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{eccd.school_address}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{eccd.barangay}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200"> {eccd.remarks ? eccd.remarks.slice(0, 3) : ""}</td> 
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                <button onClick={() => handleViewClick(eccd)}  className="bg-white px-3 py-1 border rounded-md text-blue-500 hover:text-blue-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaEye /></button>
                                                <button onClick={() => handleEditClick(eccd)} className="bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
                                            </td>  
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div> 
                </div>
                <div className="flex justify-end -mt-8"> 
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredEccdInfo.length}
                        onChange={handlePageChange}
                        showSizeChanger
                        onShowSizeChange={handlePageSizeChange}   
                        pageSizeOptions={['5', '10', '20', '50' , '100', '1000']}  
                        // showQuickJumper
                    />
                </div> 
                <Modal  show={openImportModal}  size='md' onClose={() => setOpenImportModal(false)}>
                    <Modal.Header>
                        <h1 className='font-serif'>Import ECCD file</h1>
                    </Modal.Header>
                    <Modal.Body>
                       <div className="flex flex-col space-y-4">
                          <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} className="border p-2 rounded dark:border-gray-500" />
                                                {/* <button 
                                                    onClick={handleImportSubmit} 
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                                                >
                                                    Import File
                                                </button> */}
                           <div className='flex justify-center'>
                               <button onClick={handleImportSubmit}  disabled={loading}  className={`font-serif text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                                            
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

                <Modal show={openCreateModal}  size='xl' onClose={() => setOpenCreateModal(false)}>
                    <Modal.Header>
                        <h1 className='font-serif'>Add ECCD</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className='grid grid-cols-2 gap-5'> 
                                    <div>
                                        <label htmlFor="children_name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Children Name</label>
                                        <input type="text" name="children_name" value={formData.children_name} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    required/>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-5'> 
                                    <div>
                                        <label htmlFor="age" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Age</label>
                                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="sex" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Gender</label>
                                        <select name="sex" value={formData.sex} onChange={handleInputChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className='font-serif '>Select Gender</option> 
                                            <option value="M" className='font-serif '>Male</option> 
                                            <option value="F" className='font-serif '>Female</option> 
                                        </select>
                                    </div> 
                                </div>
                                <div>
                                    <label className="font-serif mt-2 block -mb-2 text-md font-medium text-gray-900 dark:text-white">
                                        Attending School
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">   
                                        <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700">
                                            <input id="yes" type="radio" name="attending_school" value="/" checked={formData.yes === "/"} onChange={() => setFormData({ ...formData, yes: "/", no: "" })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="yes" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Yes </label>
                                        </div>
 
                                        <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700">
                                            <input id="no" type="radio" name="attending_school" value="/" checked={formData.no === "/"} onChange={() => setFormData({ ...formData, yes: "", no: "/" })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="no" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> No </label>
                                        </div>
                                    </div>
                                </div> 
                                    <div className='grid grid-cols-1 '> 
                                        <div>
                                            <label htmlFor="school_name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">School Name</label>
                                            <input type="text" name="school_name" value={formData.school_name} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                        </div>
                                        <div>
                                            <label htmlFor="school_address" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">School Address</label>
                                            <input type="text" name="school_address" value={formData.school_address} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                        </div>
                                        <div>
                                            <label htmlFor="school_name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Barangay</label>
                                            <input type="text" name="barangay" value={formData.barangay} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                        </div>
                                        <div>
                                            <label htmlFor="remarks" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Remarks</label>
                                            <input type="text" name="remarks" value={formData.remarks} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                        </div>
                                    </div>
                                    <Button type='submit' className='mt-2'>Create</Button>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={openViewModal}  size='xl' onClose={() => setOpenViewModal(false)}>
                    <Modal.Header>
                        <h1>Personal Info</h1>
                    </Modal.Header>
                    <Modal.Body>
                    {selectedEccdInfo && (
                            <div className="bg-gray-100 rounded-lg p-6 shadow-md dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                <div className="flex flex-col gap-4">  

                                    <div className="border-b pb-2 dark:border-gray-500">
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Children Name</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">
                                        {selectedEccdInfo.children_name}
                                        </p>
                                    </div>
 
                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Age</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedEccdInfo.age}</p>
                                        </div>
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Sex</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedEccdInfo.sex}</p>
                                        </div>
                                    </div>
 
                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Attending to School</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200"> 
                                                {selectedEccdInfo.yes === '/' || !selectedEccdInfo.no ? 'Yes' : selectedEccdInfo.no === '/' || !selectedEccdInfo.yes ? 'No' : ''}
                                            </p>
                                        </div> 
                                    </div>
                                    
                                    <div>
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">School Name</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedEccdInfo.school_name}</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Barangay</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedEccdInfo.barangay}</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">School Address</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedEccdInfo.school_address}</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Remarks</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedEccdInfo.remarks}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className='flex justify-end'>
                        <Button 
                            onClick={() => setOpenViewModal(false)} 
                            className="font-serif bg-red-600 text-white rounded-md hover:bg-red-700 transition-all dark:bg-red-500"
                        >
                            Close
                        </Button>
                        <Button onClick={() => handleEditClick(selectedEccdInfo)} className="font-serif text-white rounded-md   transition-all  ">
                            Edit
                        </Button>
                    </Modal.Footer>                   
                                        
                </Modal>

                <Modal show={openEditModal}  size='xl' onClose={() => setOpenEditModal(false)}>
                    <Modal.Header>
                        <h1>Edit Personal Info</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleUpdate}>
                            <div> 
                                <div>
                                    <label className="block font-serif">Client Name</label>
                                    <input type="text" name="children_name" value={formData.children_name} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                                </div> 
                            </div>
                            <div className='grid grid-cols-2 gap-5'>
                                <div>
                                    <label htmlFor="sex" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Gender</label>
                                        <select name="sex" value={formData.sex} onChange={handleChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className='font-serif '>Select Gender</option> 
                                            <option value="M" className='font-serif '>Male</option> 
                                            <option value="F" className='font-serif '>Female</option> 
                                        </select>
                                    </div> 
                                <div>
                                    <label className="block font-serif mt-3">Age</label>
                                    <input type="text" name="age" value={formData.age} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                                </div>
                            </div>
                            <div> 
                                <div>
                                    <label className="font-serif mt-2 block -mb-2 text-md font-medium text-gray-900 dark:text-white">
                                        Attending School
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">   
                                        <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700">
                                            <input id="yes" type="radio" name="attending_school" value="/" checked={formData.yes === "/"} onChange={() => setFormData({ ...formData, yes: "/", no: "" })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="yes" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Yes </label>
                                        </div>
 
                                        <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700">
                                            <input id="no" type="radio" name="attending_school" value="/" checked={formData.no === "/"} onChange={() => setFormData({ ...formData, yes: "", no: "/" })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                                            <label htmlFor="no" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> No </label>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div>
                                <div>
                                    <label className="block font-serif">School Name</label>
                                    <input type="text" name="school_name" value={formData.school_name} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                                </div>
                                <div>
                                    <label className="block font-serif">Barangay</label>
                                    <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                                </div>
                                <div>
                                    <label className="block font-serif">School Address</label>
                                    <input type="text" name="school_address" value={formData.school_address} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                                </div>
                                <div>
                                    <label className="block font-serif">Remarks</label>
                                    <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                                </div>
                            </div>
                            <div className='flex justify-end mt-4'>
                                <Button type='submit'>Submit</Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div> 
        </div>
    );
};

export default Opol_ECCD;
