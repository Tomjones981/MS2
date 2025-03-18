 
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
import Enrollees_Report from '../Reports/CDC/Enrollees_Report';

const Enrollees_CDC = () => {
    const { SubCatId } = useParams();
    const navigate = useNavigate();
    
    const [subCatInfo, setSubCatInfo] = useState({
        sub_cat_name: "",
        age_range: "",
        description: ""
    });

    const [cdcInfo, setCdcInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);  
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    
    const [formData, setFormData] = useState({
        sub_cat_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        barangay: '',
        M: '',
        F: '',
        months_old: '',
        "1_11_yrs_old": '',
        "2_11_yrs_old": '',
        "3_11_yrs_old": '',
        "4_11_yrs_old": '',
        "5_yrs_old": '',
        pwd: '',
    });

    useEffect(() => {
        if (SubCatId) {
            fetchsubCatNames(SubCatId);
            fetchCdcInfo(SubCatId);
        }
    }, [SubCatId]);

    const fetchCdcInfo = async (SubCatId) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/sub-category/personal-info/${SubCatId}`);
            setCdcInfo(response.data || []);
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
            sub_cat_id: SubCatId,  
            first_name: '',
            middle_name: '',
            last_name: '',
            birthday: '',
            barangay: '',
            M: '',  
            F: '//',  
            months_old: '',
            "1_11_yrs_old": '',
            "2_11_yrs_old": '',
            "3_11_yrs_old": '',
            "4_11_yrs_old": '',
            "5_yrs_old": '',
            pwd: '',
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
            const response = await axiosClient.post('/opol-cdc-create', {
                sub_cat_id: SubCatId,
                first_name: formData.first_name,
                middle_name: formData.middle_name,
                last_name: formData.last_name,
                birthday: formData.birthday,
                barangay: formData.barangay,
                M: formData.M, // Will be "/" if Male
                F: formData.F, // Will be "//" if Female
                months_old: formData.months_old,
                "1_11_yrs_old": formData["1_11_yrs_old"],
                "2_11_yrs_old": formData["2_11_yrs_old"],
                "3_11_yrs_old": formData["3_11_yrs_old"],
                "4_11_yrs_old": formData["4_11_yrs_old"],
                "5_yrs_old": formData["5_yrs_old"],
                pwd: formData.pwd,
            });
    
            message.success("Successfully Created");
            setOpenCreateModal(false);
            setFormData({
                sub_cat_id: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                birthday: '',
                barangay: '',
                M: '',
                F: '//', // Reset default to Female
                months_old: '',
                "1_11_yrs_old": '',
                "2_11_yrs_old": '',
                "3_11_yrs_old": '',
                "4_11_yrs_old": '',
                "5_yrs_old": '',
                pwd: '',
            });
            fetchCdcInfo(SubCatId);
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
            await axiosClient.post("/opol-cdc-import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            message.success("Import successful!");
            setOpenImportModal(false);
            fetchCdcInfo(SubCatId);
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
            link.setAttribute('download', 'OPOL_CDC_ENROLLEES.xlsx');
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
    const filteredCdcInfo = cdcInfo.filter(cdc => {
        const query = searchQuery.toLowerCase();
        return cdc.first_name.toLowerCase().includes(query) ||
               cdc.last_name.toLowerCase().includes(query);
    });
    

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const paginatedData = filteredCdcInfo.slice(
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
    const [selectedCdcInfo, setSelectedCdcInfo] = useState(null);
    const handleViewClick = (cdcInfo) => {
        setSelectedCdcInfo(cdcInfo);
        setOpenViewModal(true);
    } 

    
    const [openViewReportModal, setOpenViewReportModal] = useState(false);
    const handleCliCkReportView = (state) => {
        setOpenViewReportModal(state);
    }

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
                                    <button  type='button'  onClick={() => handleCliCkReportView(true)}  className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
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
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Full Name</th> 
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Birthday</th>
                                        <th className="font-serif p-3 text-sm font-semibold tracking-wide text-left">Barangay</th>
                                        <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Gender </th>
                                        <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">Year Old</th>
                                        {/* <th className="font-serif w-24 p-3 text-sm font-semibold tracking-wide text-left">PWD</th> */}
                                        <th className="font-serif w-32 p-3 text-sm font-semibold tracking-wide text-center">Action</th>
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
                                        paginatedData.map((cdc) => (
                                        <tr key={cdc.id} className="bg-white dark:bg-gray-800"> 
                                            <td className="font-serif p-3 text-sm text-gray-700   dark:text-gray-200">{cdc.last_name}, {cdc.first_name} {cdc.middle_name}</td> 
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{cdc.birthday}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{cdc.barangay}</td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap">  
                                                <span className="font-serif p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50 dark:text-gray-200 dark:bg-green-600">
                                                {cdc.M === '/' || !cdc.F ? 'Male' : cdc.F === '/' || !cdc.M ? 'Female' : ''}
                                                </span>
                                                
                                            </td>
                                            <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200 text-center">
                                                {cdc.months_old === '/' ? 'Months Old' :
                                                cdc["1_11_yrs_old"] === '/' ? '1.11' :
                                                cdc["2_11_yrs_old"] === '/' ? '2.11' :
                                                cdc["3_11_yrs_old"] === '/' ? '3.11' :
                                                cdc["4_11_yrs_old"] === '/' ? '4.11' :
                                                cdc["5_yrs_old"] === '/' ? '5' :
                                                ''}
                                            </td>
                                            {/* <td className="p-3 text-sm text-gray-700 ">{cdc.pwd}</td> */}
                                           <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                <button onClick={() => handleViewClick(cdc)} className="bg-white px-3 py-1 border rounded-md text-blue-500 hover:text-blue-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaEye /></button>
                                                <button  className="bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
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
                        total={filteredCdcInfo.length}
                        onChange={handlePageChange}
                        showSizeChanger
                        onShowSizeChange={handlePageSizeChange}   
                        pageSizeOptions={['5', '10', '20', '50' , '100', '1000']}  
                        // showQuickJumper
                    />
                </div>
                
                <Modal show={openCreateModal} size='2xl' onClose={() => setOpenCreateModal(false)}>
                    <Modal.Header className=''>
                        <h1 className='font-serif'>Add CDC </h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form onSubmit={handleSubmit}> 
                                <div className='grid grid-cols-1 gap-2'>
                                    <div>
                                        <label htmlFor="first_name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">First Name</label>
                                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="middle_name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Middle Name</label>
                                        <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="last_name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Last Name</label>
                                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-5'> 
                                    <div>
                                        <label htmlFor="birthday" className="font-serif mt-2 block  text-md font-medium text-gray-900 dark:text-white">Birth Date</label>
                                        <DatePicker  format="YYYY-MM-DD" name="birthday" onChange={handleDateChange}  className='font-serif bg-gray-50 h-9 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200' required/>
                                    </div> 
                                    <div className='mt-9'> 
                                        <select name="barangay" value={formData.barangay} onChange={handleChange} className='h-9 w-[10.3rem] font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="" className='font-serif'>Select Barangay</option>
                                            <option value="AWANG" className='font-serif '>Awang</option> 
                                            <option value="BAGOCBOC" className='font-serif '>Bagocboc</option> 
                                            <option value="BARRA" className='font-serif '>Barra</option> 
                                            <option value="BONBON" className='font-serif '>Bonbon</option> 
                                            <option value="CAUYONAN" className='font-serif '>Cauyonan</option> 
                                            <option value="IGPIT" className='font-serif '>Igpit</option> 
                                            <option value="L-BONBON" className='font-serif '>Luyong Bonbon</option> 
                                            <option value="LIMONDA" className='font-serif '>Limonda</option> 
                                            <option value="MALANANG" className='font-serif '>Malanang</option> 
                                            <option value="NANGCAON" className='font-serif '>Nangcaon</option> 
                                            <option value="PATAG" className='font-serif '>Patag</option> 
                                            <option value="POBLACION" className='font-serif '>Poblacion</option> 
                                            <option value="TINGALAN" className='font-serif '>Tingalan</option> 
                                            <option value="TABOC" className='font-serif '>Taboc</option> 
                                        </select>
                                    </div> 
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4"> 
                                    {/* Male */}
                                    <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700">
                                        <input id="M" type="radio" name="gender" value="/" checked={formData.M === "/"} onChange={() => setFormData({ ...formData, M: "/", F: "" })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="M" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                                    </div>

                                    {/* Female */}
                                    <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700">
                                        <input id="F" type="radio" name="gender" value="//" checked={formData.F === "//"} onChange={() => setFormData({ ...formData, M: "", F: "//" })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="F" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                                    </div>
                                </div>

 
                                {/* <div className="border border-gray-300 rounded-lg mt-4">
                                    <div className="grid grid-cols-3 md:grid-cols-3"> 
                                        <div className="flex items-center justify-center border-b border-r border-gray-300 p-2">
                                            <input id="months_old" type="radio" value={formData.months_old} onChange={handleChange} name="months_old"  className="w-4 h-4" />
                                            <label htmlFor="months_old" className="ms-2 text-sm font-medium text-gray-900"> Months Old </label>
                                        </div>
                                        <div className="flex items-center justify-center border-b border-r border-gray-300 p-2">
                                            <input id="1_11_yrs_old" type="radio" value={formData["1_11_yrs_old"]} onChange={handleChange} name="1_11_yrs_old" className="w-4 h-4" />
                                            <label htmlFor="1_11_yrs_old" className="ms-2 text-sm font-medium text-gray-900"> 1.11 Y/ Old </label>
                                        </div>
                                        <div className="flex items-center justify-center border-b border-gray-300 p-2">
                                            <input id="2_11_yrs_old" type="radio" value={formData["2_11_yrs_old"]} onChange={handleChange} name="2_11_yrs_old" className="w-4 h-4" />
                                            <label htmlFor="2_11_yrs_old" className="ms-2 text-sm font-medium text-gray-900"> 2.11 Y/ Old </label>
                                        </div>
 
                                        <div className="flex items-center justify-center border-b border-r border-gray-300 p-2">
                                            <input id="3_11_yrs_old" type="radio" value={formData["3_11_yrs_old"]} onChange={handleChange} name="3_11_yrs_old" className="w-4 h-4" />
                                            <label htmlFor="3_11_yrs_old" className="ms-2 text-sm font-medium text-gray-900"> 3.11 Y/ Old </label>
                                        </div>
                                        <div className="flex items-center justify-center border-b border-r border-gray-300 p-2">
                                            <input id="4_11_yrs_old" type="radio" value={formData["4_11_yrs_old"]} onChange={handleChange} name="4_11_yrs_old" className="w-4 h-4" />
                                            <label htmlFor="4_11_yrs_old" className="ms-2 text-sm font-medium text-gray-900"> 4.11 Y/ Old </label>
                                        </div>
                                        <div className="flex items-center justify-center border-b border-gray-300 p-2">
                                            <input id="5_yrs_old" type="radio" value={formData["5_yrs_old"]} onChange={handleChange} name="5_yrs_old" className="w-4 h-4" />
                                            <label htmlFor="5_yrs_old" className="ms-2 text-sm font-medium text-gray-900"> 5 Y/ Old </label>
                                        </div>
 
                                        <div className="flex items-center justify-center p-2 col-span-3">
                                            <input id="pwd" type="radio" value={formData.pwd} onChange={handleChange} name="pwd" className="w-4 h-4" />
                                            <label htmlFor="pwd" className="ms-2 text-sm font-medium text-gray-900"> PWD </label>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="border border-gray-300 rounded-lg mt-4">
                                    <div className="grid grid-cols-3 md:grid-cols-3"> 
                                        <div className="flex items-center justify-center border-b border-r border-gray-300 p-2">
                                            <input 
                                                id="months_old" 
                                                type="radio" 
                                                name="age" 
                                                value="/" 
                                                checked={formData.months_old === "/"} 
                                                onChange={() => setFormData({ ...formData, months_old: "/", "1_11_yrs_old": "", "2_11_yrs_old": "", "3_11_yrs_old": "", "4_11_yrs_old": "", "5_yrs_old": "" })}  
                                                className="w-4 h-4" 
                                            />
                                            <label htmlFor="months_old" className="ms-2 text-sm font-medium text-gray-900"> Months Old </label>
                                        </div>
                                        
                                        {[
                                            { id: "1_11_yrs_old", label: "1.11 Y/ Old" },
                                            { id: "2_11_yrs_old", label: "2.11 Y/ Old" },
                                            { id: "3_11_yrs_old", label: "3.11 Y/ Old" },
                                            { id: "4_11_yrs_old", label: "4.11 Y/ Old" },
                                            { id: "5_yrs_old", label: "5 Y/ Old" }
                                        ].map(({ id, label }) => (
                                            <div key={id} className="flex items-center justify-center border-b border-r border-gray-300 p-2">
                                                <input 
                                                    id={id} 
                                                    type="radio" 
                                                    name="age" 
                                                    value="/" 
                                                    checked={formData[id] === "/"} 
                                                    onChange={() => setFormData({ 
                                                        ...formData, 
                                                        months_old: "", "1_11_yrs_old": "", "2_11_yrs_old": "", "3_11_yrs_old": "", "4_11_yrs_old": "", "5_yrs_old": "", 
                                                        [id]: "/" 
                                                    })}  
                                                    className="w-4 h-4" 
                                                />
                                                <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900">{label}</label>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-center p-2 col-span-3">
                                            <input 
                                                id="pwd" 
                                                type="radio" 
                                                name="pwd" 
                                                value="/" 
                                                checked={formData.pwd === "/"} 
                                                onChange={() => setFormData({ ...formData, pwd: "/" })}  
                                                className="w-4 h-4" 
                                            />
                                            <label htmlFor="pwd" className="ms-2 text-sm font-medium text-gray-900">PWD</label>
                                        </div>
                                    </div>
                                </div>



                               <div className='mt-3 flex justify-end'>
                                    <Button type='submit'>Submit</Button>
                               </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={openImportModal} size='md' onClose={() => setOpenImportModal(false)}>
                    <Modal.Header>
                        <h1 className='font-serif'>Import CDC File</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="flex flex-col space-y-4">
                            <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} className="border p-2 rounded dark:border-gray-500" />
                            {/* <button onClick={handleImportSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition" >
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
                <Modal show={openViewModal} size='lg' onClose={() => setOpenViewModal(false)}>
                    <Modal.Header>
                        <h1 className='font-serif text-lg font-bold text-gray-800 dark:text-gray-200'>Personal Information</h1>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedCdcInfo && (
                            <div className="bg-gray-100 rounded-lg p-6 shadow-md dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                <div className="flex flex-col gap-4"> 
                                    <div className="border-b pb-2 dark:border-gray-500">
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">ID Number</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedCdcInfo.id}</p>
                                    </div>

                                    <div className="border-b pb-2 dark:border-gray-500">
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Full Name</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">
                                            {`${selectedCdcInfo.last_name}, ${selectedCdcInfo.first_name} ${selectedCdcInfo.middle_name || ''}`}
                                        </p>
                                    </div>
 
                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Birthday</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedCdcInfo.birthday}</p>
                                        </div>
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Barangay</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedCdcInfo.barangay}</p>
                                        </div>
                                    </div>

                                    {/* Gender & Age */}
                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Gender</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">
                                                {selectedCdcInfo.M === '/' || !selectedCdcInfo.F ? 'Male' : 
                                                selectedCdcInfo.F === '/' || !selectedCdcInfo.M ? 'Female' : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Age</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">
                                                {selectedCdcInfo.months_old === '/' ? 'Months Old' :
                                                selectedCdcInfo["1_11_yrs_old"] === '/' ? '1.11 Years Old' :
                                                selectedCdcInfo["2_11_yrs_old"] === '/' ? '2.11 Years Old' :
                                                selectedCdcInfo["3_11_yrs_old"] === '/' ? '3.11 Years Old' :
                                                selectedCdcInfo["4_11_yrs_old"] === '/' ? '4.11 Years Old' :
                                                selectedCdcInfo["5_yrs_old"] === '/' ? '5 Years Old' :
                                                'N/A'}
                                            </p>
                                        </div>
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
                        <Button className="font-serif text-white rounded-md   transition-all  ">
                            Edit
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={openViewReportModal} size='5xl' onClose={() => setOpenViewReportModal(false)}>
                    <Modal.Header>
                        <h1>Report</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <Enrollees_Report />
                    </Modal.Body>
                </Modal>

               
            </div> 
        </div>
    );
};

export default Enrollees_CDC;
