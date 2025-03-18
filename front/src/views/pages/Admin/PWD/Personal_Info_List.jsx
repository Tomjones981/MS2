import React, { useEffect, useState } from 'react';
import { FiMoreVertical, FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners'  
import axiosClient from '../../../../api/axiosClient';
import { FaEye, FaRegEdit } from "react-icons/fa";
import { Button, Modal } from 'flowbite-react';
import { message, Pagination } from 'antd'
import { IoArrowBackOutline } from "react-icons/io5";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import PWD_REPORT from '../Dashboard/CHILDREN/PWD/PWD_Total_List'
const Personal_Info_List = () => {
    const { SubCatId } = useParams();
    const [subCatInfo, setSubCatInfo] = useState({
        sub_cat_name: "",
        age_range: "",
        description: ""
    });
    const [personalInfo, setPersonalInfo] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Sub Cat ID:", SubCatId);
        if (SubCatId) {
            fetchsubCatNames(SubCatId);
            fetchSubpersonalInfo(SubCatId);
        }
    }, [SubCatId]);

    const fetchSubpersonalInfo = async (SubCatId) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/sub-category/personal-info/${SubCatId}`);
            setPersonalInfo(response.data); 
        } catch (error) {
            console.error("Error fetching Personal Info:", error);
            message.error("Failed to fetch personal info.");
        }
        setLoading(false);
    };

    const fetchsubCatNames = async (SubCatId) => {
        try {
            const response = await axiosClient.get(`/brgy-sectors/sub-category/sub-cat-name/${SubCatId}`);
            setSubCatInfo(response.data);
        } catch (error) {
            console.error("Error fetching sub category details:", error);
        }
    };

    const [errors, setErrors] = useState({});
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        id_number: '',
        name: '',
        barangay: '',
        disability:'',
        birthday: '',
        sex: '',
        blood_type: '',
        age: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleOpenCreateModal = () => {
        setFormData({  
            name: "",
            barangay: "",
            disability: "",
            birthday: "",
            sex: "",
            id_number: "",
            blood_type: "",
            age: "",
        });  
        setOpenCreateModal(true);
    };
    const handleSubmit  = async (e) => {
        e.preventDefault();
        setErrors({});

        try{
            const response = await axiosClient.post('/personal-info-create', {
                sub_cat_id : SubCatId,
                ...formData
            });

            console.log("Success:", response.data);
            message.success("successfully Created");
            setOpenCreateModal(false);
            fetchSubpersonalInfo(SubCatId);
            setFormData({
                id_number: '',
                name: '',
                barangay: '',
                disability: '',
                birthday: '',
                sex: '',
                blood_type: '',
                age: '',
            });
        } catch (error) {
            if ( error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error Creating person info", error);
                message.error("Error Creating Info.")
            }
        }
    };

    const [openImportModal, setOpenImportModal] = useState(false);
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
            const response = await axiosClient.post("/pwd-import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });
    
            message.success("Import successful!");
            setOpenImportModal(false);
            setImportFile(null);
            fetchSubpersonalInfo(SubCatId); 
            
        } catch (error) {
            console.error("Error importing logbook data:", error.response?.data);
            message.error("Failed to import records!");
        } finally {
            setLoading(false);
        }
    };

    const [barangayFilter, setBarangayFilter] = useState("");
    const handleBarangayChange = (e) => {
        setBarangayFilter(e.target.value);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const filteredPersonalInfo = personalInfo.filter(info => {
        const matchesBarangay = barangayFilter ? info.barangay === barangayFilter : true;
        const matchesSearch = 
            info.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            info.id_number.toLowerCase().includes(searchQuery.toLowerCase()); // Added search for id_number
        return matchesBarangay && matchesSearch;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const paginatedData = filteredPersonalInfo.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // setPageSize(pageSize);
    };
    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
        setCurrentPage(1);   
    };

    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedPersonalInfo, setSelectedPersonalInfo] = useState(null);
    const handleViewClick = (personInfo) => {
        setSelectedPersonalInfo(personInfo);
        setOpenViewModal(true);
    }


    const handleExport = async () => {
        try {
            const response = await axiosClient.get(`/pwd-export-excel-personal-info/${SubCatId}`, {
                responseType: 'blob',  
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'PWD_Personal_Info.xlsx');  
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Export successful!");
        } catch (error) {
            console.error("Error exporting file:", error);
            message.error("Failed to export data.");
        }
    };

    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const handleEditClick = (record) => {
            setSelectedInfo(record);
            setFormData({
                name: record.name,
                barangay: record.barangay,
                disability: record.disability,
                birthday: record.birthday,
                sex: record.sex,
                id_number: record.id_number,
                blood_type: record.blood_type,
                age: record.age
            });
            setOpenEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await axiosClient.put(`/personal-info-update/${selectedInfo.id}`, {
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
            fetchSubpersonalInfo(SubCatId);  
        } catch (error) {
            console.error("Error updating personal info:", error.response?.data);
            message.error("Failed to update info!");
        } finally {
            setLoading(false);
        }
    }; 
    const navigate = useNavigate(); 
    
    const [openViewReportModal, setOpenViewReportModal] = useState (false);
    const [openMenu, setOpenMenu] = useState(false);
    
    return (
        <div className='p-5'>
            {/* <button onClick={() => navigate(-1)} className='-mb-10   flex items-center gap-2 p-3   text-gray-800 rounded-md font-bold text-[3rem] transition-all'>
                <p className=' '>
                    <IoArrowBackOutline/>
                </p>
            </button> */}
            <div className='mt-2 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                <div className='flex justify-between items-center p-2 mb-2 -mt-3 dark:bg-gray-800'>
                    <button onClick={() => navigate(-1)} className='shadow-xl -ml-[3rem] -mr-[34rem] border border-gray-200 bg-gray-600 flex items-center gap-2 p-2 text-gray-200 rounded-md font-bold text-xl transition-all hover:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                        <ReplyAllIcon className='text-2xl  ' /> 
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 font-serif dark:text-gray-200">
                        <span className="text-blue-600 font-serif underline">
                            {/* {subCatInfo.id || "Loading..."}{" "}  */}
                            {subCatInfo.sub_cat_name || "Loading..."}{" "} 
                            {subCatInfo.age_range || "Loading..."}{" "}
                            {subCatInfo.description || ""}  
                        </span> Category
                    </h1>
                    <div className="flex space-x-2 -mt-1"> 
                        <button onClick={() => setOpenMenu(!openMenu)} className="p-2 rounded-full bg-gray-600 text-white shadow-md hover:bg-gray-500 transition">
                            <FiMoreVertical className="text-xl" />
                        </button>

                        {openMenu && (
                            <div className=' '>
                                <div className='absolute right-[5rem] mt-10  flex gap-5 w-[30rem] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10'>
                                    <button  type='button' onClick={() => setOpenViewReportModal(true)} className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                        Reports
                                    </button>
                                    <button onClick={handleExport} className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                        <FiDownload className="text-lg" />
                                        Export
                                    </button>
                                    <button  type='button' onClick={() => setOpenImportModal(true)} className="font-serif flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                                        <FiUpload className="text-lg" />
                                        Import
                                    </button>
                                    <button type='button' onClick={() => handleOpenCreateModal(true)} className="font-serif flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                                        <FiPlus className="text-lg" />
                                        Add  
                                    </button>
                                </div>
                            </div>
                        )} 
                    </div>
                </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }} />
                
                <div className='grid grid-cols-10 mt-6 mb-2 gap-4 '> 
                    <div className='col-span-7'> 
                        <select name={barangayFilter}  onChange={handleBarangayChange}  className='h-9 font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                            <option value="" className='font-serif'>All</option>
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
                    <div className="relative col-span-3 flex items-end">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-6">
                            <svg className="mb-5 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search"  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  className="font-serif block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
                    </div>
                </div>

                <div className='h-[21rem] mt-5'> 
                        <div className="max-h-[18rem] overflow-y-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <table className="w-full ">
                                <thead className='text-gray-800 sticky top-0 bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200'>
                                    <tr className="">
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">ID Number</th>
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Name</th>
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Barangay</th>
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Disability</th>
                                        {/* <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Birthday</th>
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Sex</th>
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Blood Type</th>
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Age</th> */}
                                        <th className="font-serif w-20 p-3 text-sm font-semibold tracking-wide text-left">Actions</th>
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
                                        paginatedData.map((info) => (
                                            <tr key={info.id} className="bg-white dark:bg-gray-800">
                                            <td className="font-serif p-3 text-sm text-blue-500 font-bold whitespace-nowrap hover:underline dark:text-gray-200">{info.id_number || "N/A"} </td>
                                                <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200   ">{info.name || "N/A"}</td>
                                                <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200  ">{info.barangay || "N/A"}</td>
                                                <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200   ">{info.disability || "N/A"}</td>
                                                {/* <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200  ">{info.birthday || "N/A"}</td>
                                                <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{info.sex || "N/A"}</td>
                                                <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{info.blood_type || "N/A"}</td>
                                                <td className="font-serif p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">{info.age || "N/A"}</td> */}
                                                <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                    <button   onClick={() => handleViewClick(info)} className="bg-white px-3 py-1 border rounded-md text-blue-500 hover:text-blue-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaEye /></button>
                                                    <button   onClick={() => handleEditClick(info)} className="bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
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
                                total={filteredPersonalInfo.length}
                                onChange={handlePageChange}
                                showSizeChanger
                                onShowSizeChange={handlePageSizeChange}   
                                pageSizeOptions={['5', '10', '20', '50' , '100', '1000']}  
                                // showQuickJumper
                            /> 
                        </div>
                </div> 

                <Modal show={openCreateModal} size='xl' onClose={() => setOpenCreateModal(false)} >
                    <Modal.Header>
                        <span className="text-blue-600 font-serif underline">
                            {subCatInfo.sub_cat_name || "Loading..."}{" "}
                            {subCatInfo.age_range || "Loading..."}{" "}
                            {subCatInfo.description || ""}
                        </span>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className='grid grid-cols-2 gap-5'> 
                                    <div>
                                        <label htmlFor="id_number" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Id Number</label>
                                        <input type="text" name="id_number" value={formData.id_number} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="barangay" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Barangay</label>
                                        <select name="barangay" value={formData.barangay} onChange={handleInputChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="">Select Barangay</option>
                                            <option value="AWANG" className='font-serif '>Awang</option> 
                                            <option value="BAGOCBOC" className='font-serif '>Bagocboc</option> 
                                            <option value="BONBON" className='font-serif '>Bonbon</option> 
                                            <option value="CAUYONAN" className='font-serif '>Cauyunan</option> 
                                            <option value="IGPIT" className='font-serif '>Igpit</option> 
                                            <option value="L-BONBON" className='font-serif '>Luyong Bonbon</option> 
                                            <option value="LIMUNDA" className='font-serif '>Limunda</option> 
                                            <option value="MALANANG" className='font-serif '>Malanang</option> 
                                            <option value="NANGCAON" className='font-serif '>Nangcaon</option> 
                                            <option value="PATAG" className='font-serif '>Patag</option> 
                                            <option value="POBLACION" className='font-serif '>Poblacion</option> 
                                            <option value="TINGALAN" className='font-serif '>Tingalan</option> 
                                            <option value="TABOC" className='font-serif '>Taboc</option> 
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="disability" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Disability</label>
                                        <input type="text" name="disability" value={formData.disability} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="birthday" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Birthday</label>
                                        <input type="text" name="birthday" value={formData.birthday} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="sex" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Barangay</label>
                                        <select name="sex" value={formData.sex} onChange={handleInputChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="">Select Sex</option> 
                                            <option value="M" className='font-serif '>Male</option> 
                                            <option value="F" className='font-serif '>Female</option> 
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="blood_type" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Barangay</label>
                                        <select name="blood_type"  value={formData.blood_type} onChange={handleInputChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="">Select Blood Type</option> 
                                            <option value="A" className='font-serif '>A</option>  
                                            <option value="A+" className='font-serif '>A+</option>  
                                            <option value="A-" className='font-serif '>A-</option>  
                                            <option value="AB" className='font-serif '>AB</option> 
                                            <option value="B" className='font-serif '>B</option>  
                                            <option value="B+" className='font-serif '>B+</option>  
                                            <option value="B-" className='font-serif '>B-</option>  
                                            <option value="AB+" className='font-serif '>AB+</option>    
                                            <option value="AB-" className='font-serif '>AB-</option>    
                                            <option value="O" className='font-serif '>O</option>    
                                            <option value="O+" className='font-serif '>O+</option> 
                                            <option value="O-" className='font-serif '>O-</option>      
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="age" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Age</label>
                                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div> 

                                </div>
                                    <div className="flex justify-end mt-4">
                                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                                            Submit
                                        </button>
                                    </div>
                                    
                            </form>
                        </div>
                    </Modal.Body>
                </Modal> 

                <Modal show={openImportModal} size='md' onClose={() => setOpenImportModal(false)}>
                    <Modal.Header>
                        <h1 className='font-serif'>Import PWD File</h1>
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

                <Modal show={openViewModal} size="lg" onClose={() => setOpenViewModal(false)}>
                    <Modal.Header>
                        <h1 className="font-serif text-lg font-bold text-gray-800 dark:text-gray-200">
                            Personal Info Details
                        </h1>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedPersonalInfo && (
                            <div className="bg-gray-100 rounded-lg p-6 shadow-md dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                <div className="flex flex-col gap-4">
                                    
                                    <div className="border-b pb-2 dark:border-gray-500">
                                        <p className="font-serif text-sm text-gray-600 dark:text-gray-200">ID Number</p>
                                        <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.id_number}</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Full Name</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.name}</p>
                                        </div>
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Disability</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.disability || "None"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-b pb-2 dark:border-gray-500">
                                        
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Birthday</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.birthday}</p>
                                        </div>
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Barangay</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.barangay}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Sex</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.sex}</p>
                                        </div>
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Blood Type</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.blood_type}</p>
                                        </div>
                                        <div>
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Age</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.age}</p>
                                   
                                        </div>
                                    </div> 

                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="flex justify-end">
                        <Button 
                            onClick={() => setOpenViewModal(false)} 
                            className="font-serif bg-red-600 text-white rounded-md hover:bg-red-700 transition-all dark:bg-red-500">
                            Close
                        </Button>
                        <Button  onClick={() => handleEditClick(selectedPersonalInfo)} className="font-serif   text-white rounded-md   transition-all ">
                            Edit
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={openEditModal} size='xl' onClose={() => setOpenEditModal(false)}>
                    <Modal.Header>
                        <h1 className='font-serif'>Edit</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form onSubmit={handleUpdate}>
                                <div className='grid grid-cols-2 gap-5'> 
                                    <div>
                                        <label htmlFor="id_number" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Id Number</label>
                                        <input type="text" name="id_number" value={formData.id_number} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="barangay" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Barangay</label>
                                        <select name="barangay" value={formData.barangay} onChange={handleInputChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="">Select Barangay</option>
                                            <option value="AWANG" className='font-serif '>Awang</option> 
                                            <option value="BAGOCBOC" className='font-serif '>Bagocboc</option> 
                                            <option value="BONBON" className='font-serif '>Bonbon</option> 
                                            <option value="CAUYONAN" className='font-serif '>Cauyunan</option> 
                                            <option value="IGPIT" className='font-serif '>Igpit</option> 
                                            <option value="L-BONBON" className='font-serif '>Luyong Bonbon</option> 
                                            <option value="LIMUNDA" className='font-serif '>Limunda</option> 
                                            <option value="MALANANG" className='font-serif '>Malanang</option> 
                                            <option value="NANGCAON" className='font-serif '>Nangcaon</option> 
                                            <option value="PATAG" className='font-serif '>Patag</option> 
                                            <option value="POBLACION" className='font-serif '>Poblacion</option> 
                                            <option value="TINGALAN" className='font-serif '>Tingalan</option> 
                                            <option value="TABOC" className='font-serif '>Taboc</option> 
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="disability" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Disability</label>
                                        <input type="text" name="disability" value={formData.disability} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="birthday" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Birthday</label>
                                        <input type="text" name="birthday" value={formData.birthday} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="sex" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Barangay</label>
                                        <select name="sex" value={formData.sex} onChange={handleInputChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="">Select Sex</option> 
                                            <option value="M" className='font-serif '>Male</option> 
                                            <option value="F" className='font-serif '>Female</option> 
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="blood_type" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Barangay</label>
                                        <select name="blood_type"  value={formData.blood_type} onChange={handleInputChange} className='font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="">Select Blood Type</option> 
                                            <option value="A" className='font-serif '>A</option>  
                                            <option value="A+" className='font-serif '>A+</option>  
                                            <option value="A-" className='font-serif '>A-</option>  
                                            <option value="AB" className='font-serif '>AB</option> 
                                            <option value="B" className='font-serif '>B</option>  
                                            <option value="B+" className='font-serif '>B+</option>  
                                            <option value="B-" className='font-serif '>B-</option>  
                                            <option value="AB+" className='font-serif '>AB+</option>    
                                            <option value="AB-" className='font-serif '>AB-</option>    
                                            <option value="O" className='font-serif '>O</option>    
                                            <option value="O+" className='font-serif '>O+</option> 
                                            <option value="O-" className='font-serif '>O-</option>      
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="age" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Age</label>
                                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div> 

                                </div>
                                    <div className="flex justify-end mt-4">
                                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                                            Update
                                        </button>
                                    </div>
                                    
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={openViewReportModal}  size='5xl' onClose={() => setOpenViewReportModal(false)}>
                    <Modal.Header>
                        <h1 className="text-2xl font-bold    text-gray-600 dark:text-gray-200 font-serif">
                            PWD Barangay Counts
                        </h1>
                    </Modal.Header> 
                    <Modal.Body>
                        <PWD_REPORT/>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Personal_Info_List;
