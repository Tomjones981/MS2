 
import React, { useEffect, useState } from 'react';
import { FiMoreVertical, FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import axiosClient from '../../../../api/axiosClient';
import { FaEye, FaRegEdit } from "react-icons/fa";
import { Button, Modal } from 'flowbite-react';
import { message, Pagination } from 'antd';
import { IoArrowBackOutline } from "react-icons/io5";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

const Opol_Cdc = () => {
    const { SubCatId } = useParams();
    const navigate = useNavigate();
    
    const [subCatInfo, setSubCatInfo] = useState({
        sub_cat_name: "",
        age_range: "",
        description: ""
    });

    const [personalInfo, setPersonalInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [openViewReportModal, setOpenViewReportModal] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    
    const [formData, setFormData] = useState({
        id_number: '',
        name: '',
        barangay: '',
        disability: '',
        birthday: '',
        sex: '',
        blood_type: '',
        age: '',
    });

    useEffect(() => {
        if (SubCatId) {
            fetchsubCatNames(SubCatId);
            fetchSubpersonalInfo(SubCatId);
        }
    }, [SubCatId]);

    const fetchSubpersonalInfo = async (SubCatId) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/sub-category/personal-info/${SubCatId}`);
            setPersonalInfo(response.data || []);
        } catch (error) {
            console.error("Error fetching Personal Info:", error);
            message.error("Failed to fetch personal info.");
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
            id_number: "",
            name: "",
            barangay: "",
            disability: "",
            birthday: "",
            sex: "",
            blood_type: "",
            age: "",
        });
        setOpenCreateModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await axiosClient.post('/personal-info-create', {
                sub_cat_id: SubCatId,
                ...formData
            });

            message.success("Successfully Created");
            setOpenCreateModal(false);
            fetchSubpersonalInfo(SubCatId);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error Creating person info", error);
                message.error("Error Creating Info.");
            }
        }
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
            await axiosClient.post("/pwd-import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            message.success("Import successful!");
            setOpenImportModal(false);
            fetchSubpersonalInfo(SubCatId);
        } catch (error) {
            console.error("Error importing data:", error.response?.data);
            message.error("Failed to import records!");
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className='p-5'>
            <div className='mt-2 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                 
                <div className='flex justify-between items-center p-2 mb-2 -mt-3 dark:bg-gray-800'>
                    <button onClick={() => navigate(-1)} className='shadow-xl -ml-[3rem] -mr-[42rem] border border-gray-200 bg-gray-600 flex items-center gap-2 p-2 text-gray-200 rounded-md font-bold text-xl transition-all hover:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-700'>
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
                                    <button  type='button'   className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                        Reports
                                    </button>
                                    <button   className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                        <FiDownload className="text-lg" />
                                        Export
                                    </button>
                                    <button  type='button'   className="font-serif flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                                        <FiUpload className="text-lg" />
                                        Import
                                    </button>
                                    <button type='button'   className="font-serif flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                                        <FiPlus className="text-lg" />
                                        Add  
                                    </button>
                                </div>
                            </div>
                        )} 
                    </div>
                </div>
                <div className='mt-2 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
          
                    {!loading && personalInfo.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white">
                                        <th className="p-3 border">ID</th>
                                        <th className="p-3 border">Sub Category ID</th>
                                        <th className="p-3 border">First Name</th>
                                        <th className="p-3 border">Middle Name</th>
                                        <th className="p-3 border">Last Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personalInfo.map((person, index) => (
                                        <tr key={index} className="text-center border-t dark:border-gray-600">
                                            <td className="p-3 border">{person.id}</td>
                                            <td className="p-3 border">{person.sub_cat_id}</td>
                                            <td className="p-3 border">{person.first_name}</td>
                                            <td className="p-3 border">{person.middle_name}</td>
                                            <td className="p-3 border">{person.last_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No records found.</p>
                    )} 
                </div>
            </div> 
        </div>
    );
};

export default Opol_Cdc;
