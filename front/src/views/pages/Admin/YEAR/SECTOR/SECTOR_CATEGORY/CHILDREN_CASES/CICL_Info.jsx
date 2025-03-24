 
import React, { useEffect, useState } from 'react';
import { FiMoreVertical, FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import axiosClient from '../../../../../../../api/axiosClient';
import { FaEye, FaRegEdit } from "react-icons/fa";
import { Button, Modal } from 'flowbite-react';
import { DatePicker, message, Pagination } from 'antd';
import { IoArrowBackOutline } from "react-icons/io5";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { debounce } from "lodash";
import CICL_Report from '../../../../Reports/CHILDREN_CASE/CICL/CICL_Report'
import Age_Report from '../../../../Reports/CHILDREN_CASE/CICL/Age_Report';
import { Users, AlertTriangle, ShieldAlert, Hand } from 'lucide-react';
const CICL_Info = () => {
    const { SubCatId } = useParams();
    const navigate = useNavigate();
    
    const [subCatInfo, setSubCatInfo] = useState({
        sub_cat_name: "",
        age_range: "",
        description: ""
    });

    const [ciclInfo, setCiclInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [openCreateModal, setOpenCreateModal] = useState(false);  
    const [openMenu, setOpenMenu] = useState(false);
    
    const [formData, setFormData] = useState({
        sub_cat_id: '',
        locations: '',
        code_name: '',
        age: '',
        sex: '',
        religion: '',
        educational_attainment: '', 
        educational_status: '', 
        ethnic_affiliation: '', 
        four_ps_beneficiary: '', 
        case: '', 
        case_status: '', 
        perpetrator: '', 
        interventions: '',
        children_case_type: '',
    });
 

    const fetchCiclInfo = async (SubCatId) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/sub-category/personal-info/${SubCatId}`);
            setCiclInfo(response.data || []);
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
            locations: '',
            code_name: '',
            age: '',
            sex: '',
            religion: '',
            educational_attainment: '', 
            educational_status: '', 
            ethnic_affiliation: '', 
            four_ps_beneficiary: '', 
            case: '', 
            case_status: '', 
            perpetrator: '', 
            interventions: '', 
            children_case_type: '',
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
        setLoading(true);
        setErrors({}); 
        try {
            const response = await axiosClient.post('/cicl-create', {
                sub_cat_id: SubCatId,
                locations: formData.locations,
                code_name: formData.code_name,
                age: formData.age,
                sex: formData.sex,
                religion: formData.religion,
                educational_attainment: formData.educational_attainment, 
                educational_status: formData.educational_status, 
                ethnic_affiliation: formData.ethnic_affiliation, 
                four_ps_beneficiary: formData.four_ps_beneficiary, 
                case: formData.case, 
                case_status: formData.case_status, 
                perpetrator: formData.perpetrator, 
                interventions: formData.interventions, 
                // children_case_type: formData.children_case_type, 
                 children_case_type: 'CICL', 
            });
            console.log("Success:", response.data);
            message.success("Successfully Created");
            setOpenCreateModal(false);
            setFormData({
                sub_cat_id: '',
                locations: '',
                code_name: '',
                age: '',
                sex: '',
                religion: '',
                educational_attainment: '', 
                educational_status: '', 
                ethnic_affiliation: '', 
                four_ps_beneficiary: '', 
                case: '', 
                case_status: '', 
                perpetrator: '', 
                interventions: '',
                children_case_type: '',
            });
            fetchCiclInfo(SubCatId);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error Creating CICL info", error);
                message.error("Error Creating Info.");
            }
        } finally {
            setLoading(false);
        }
    };
      
    const handlePageChange = (page) => {
        setCurrentPage(page);
    } 
    
    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
        setCurrentPage(1);
    }  
                useEffect(() => {
                    if (SubCatId) {
                        const debouncedFetch = debounce(() => {
                            fetchsubCatNames(SubCatId);
                            fetchCiclInfo(SubCatId);
                            fetchCICLLocations();
                            fetchCICLSex();
                            fetchCICLAge();
                        }, 300);  
                
                        debouncedFetch();
                    }
                }, [SubCatId]);
                

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const fetchCICLLocations = async () => {
        try {
            const response = await axiosClient.get("/cicl-locations-fetch");
            if (response.data && Array.isArray(response.data)) {
                setLocations(response.data);
            } else {
                console.error("Unexpected API response:", response.data);
            }
        } catch (error) {
            console.error("Error fetching CICL Sex:", error);
        }
    };

    const [sex, setSex] = useState([]);
    const [selectedSex, setSelectedSex] = useState("");
    const fetchCICLSex = async () => {
        try {
            const response = await axiosClient.get("/cicl-sex-fetch");
            if (response.data && Array.isArray(response.data)) {
                setSex(response.data);
            } else {
                console.error("Unexpected API response:", response.data);
            }
        } catch (error) {
            console.error("Error fetching CICL Sex:", error);
        }
    };

    const [age, setAge] = useState([]);
    const [selectedAge, setSelectedAge] = useState (""); 
    const fetchCICLAge = async () => {
        try {
            const response = await axiosClient.get("/cicl-age-fetch");
            if (response.data && Array.isArray(response.data)) {
                setAge(response.data);
            } else {
                console.error("Unexpected API response:", response.data);
            }
        } catch (error) {
            console.error("Error fetching CICL Sex:", error);
        }
    };
    
    const handleLocationChange = (e) => setSelectedLocation(e.target.value);
    const handleSexChange = (e) => setSelectedSex(e.target.value);
    const handleAgeChange = (e) => setSelectedAge(e.target.value);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredCiclInfo = ciclInfo.filter(cicl => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = cicl.code_name.toLowerCase().includes(query);
        
        const matchesLocation = selectedLocation ? cicl.locations === selectedLocation : true;
        const matchesSex = selectedSex ? cicl.sex === selectedSex : true;
        const matchesAge = selectedAge ? cicl.age === selectedAge : true;
    
        return matchesSearch && matchesLocation && matchesSex && matchesAge;
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const paginatedData = filteredCiclInfo.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
                
    const [openViewReportModal, setOpenViewReportModal] = useState(false);
    const handleCliCkReportView = (state) => {
        setOpenViewReportModal(state);
    }
    const buttons = [
           { label: 'All', route: '/brgy-sectors/sub-category/all/4',  color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
           { label: 'CICL', route: '/brgy-sectors/sub-category/cicl/4', icon: < Users />, color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
           { label: 'CAR', route: '/brgy-sectors/sub-category/car/4', icon: <AlertTriangle  />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
           { label: 'RC', route: '/brgy-sectors/sub-category/rc/4', icon: <ShieldAlert  />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
           { label: 'AC', route: '/brgy-sectors/sub-category/ac/4', icon: <Hand  />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' }, 
       ];

    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const handleEditClick = (record) => {
            setSelectedInfo(record);
            setFormData({ 
                locations: record.locations,
                code_name: record.code_name,
                age: record.age,
                sex: record.sex,
                religion: record.religion,
                educational_attainment: record.educational_attainment, 
                educational_status: record.educational_status, 
                ethnic_affiliation: record.ethnic_affiliation, 
                four_ps_beneficiary: record.four_ps_beneficiary, 
                case: record.case, 
                case_status: record.case_status, 
                perpetrator: record.perpetrator, 
                interventions: record.interventions,
                children_case_type: 'CICL', 
            });
            setOpenEditModal(true);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await axiosClient.put(`/cicl-info-update/${selectedInfo.id}`, {
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
            fetchCiclInfo(SubCatId);  
        } catch (error) {
            console.error("Error updating personal info:", error.response?.data);
            message.error("Failed to update info!");
        } finally {
            setLoading(false);
        }
    }; 

    const [openViewModal, setOpenViewModal] = useState(false);
        const [selectedPersonalInfo, setSelectedPersonalInfo] = useState(null);
        const handleViewClick = (personInfo) => {
            setSelectedPersonalInfo(personInfo);
            setOpenViewModal(true);
        }
        const handleExport = async () => {
            try {
                const response = await axiosClient.get("/children-cases-export", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    responseType: "blob",  
                });
         
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "Children_Cases_Info.xlsx");  
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
        
                message.success("Export successful!");
            } catch (error) {
                console.error("Error exporting logbook data:", error);
                message.error("Failed to export records!");
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
                const response = await axiosClient.post("/children-cases-import", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
        
                message.success("Import successful!");
                setOpenImportModal(false);
                setImportFile(null);
                fetchCiclInfo(SubCatId); 
                
            } catch (error) {
                console.error("Error importing logbook data:", error.response?.data);
                message.error("Failed to import records!");
            } finally {
                setLoading(false);
            }
        };
    return (
        <div className='p-5'>
            <div className='mt-2 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                <button onClick={() => navigate(-1)} className='-mb-10 shadow-xl -ml-[2.5rem] -mr-[38rem] border border-gray-200 bg-gray-600 flex items-center gap-2 p-2 text-gray-200 rounded-md font-bold text-xl transition-all hover:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                    <ReplyAllIcon className='text-2xl  ' /> 
                </button>
               
                <div className="bg-gray-800 p-6 m-1 rounded-lg shadow-md">  
                        <div className="flex flex-col items-start mb-5">
                          <div className="flex w-full justify-between items-center">
                            <h1 className="font-bold text-2xl text-white uppercase tracking-wide">Children Cases - CICL</h1>  
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
                                            <button onClick={handleExport} className="font-serif flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                                                <FiDownload className="text-lg" />
                                                Export
                                            </button>
                                            <button  type='button' onClick={() => setOpenImportModal(true)} className="font-serif flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
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
                          <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} />
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4">
                          {buttons.map(({ label, route, color, icon }) => (
                            <button
                              key={label}
                              onClick={() => navigate(route)}
                              type="button"
                              className={`flex items-center justify-center py-2 px-4   rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 ${color}`}
                            >
                                <span className="mr-2">{icon}</span>
                              {label}
                            </button>
                          ))}
                        </div>
               </div>
                <div className='grid grid-cols-12 mt-6 mb-2 gap-10  '>  
                    <div className='col-span-2  '>
                        <select value={selectedLocation} onChange={handleLocationChange} className="h-9 font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="" className="font-serif">Filter Locations</option>
                            {locations.map((loc, index) => (
                                <option key={index} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='col-span-2'>
                        <select value={selectedSex}  onChange={handleSexChange}  className="h-9 font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="" className="font-serif">Filter Sex</option>
                            {sex.map((se, index) => (
                                <option key={index} value={se}>
                                    {se}
                                </option>
                            ))}
                        </select>
                    </div> 
                    <div className='col-span-2'>
                        <select value={selectedAge}  onChange={handleAgeChange}  className="h-9 font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="" className="font-serif">Filter Age</option>
                            {age.map((a, index) => (
                                <option key={index} value={a}>
                                    {a}
                                </option>
                            ))}
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
                
                <div className='h-[40rem] mt-5'>  
                        <div className="max-h-[35rem] overflow-y-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <table className="w-full">
                                <thead className='text-gray-800 sticky -top-1 bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200'>
                                    <tr className=""> 
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Code Name</th>  
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Location</th>  
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Age</th>  
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Sex</th>   
                                        {/* <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Religion</th>  */}
                                        {/* <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase ">Education Att.</th>   */}
                                        {/* <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Education Status</th>   */}
                                        {/* <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Ethnic Affiliation</th>   */}
                                        {/* <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">4Ps Beneficiary</th>   */}
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Case</th>  
                                        {/* <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Case Status</th>   */}
                                        {/* <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Perpetrator</th>   */}
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Interventions</th>  
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800'>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="9" className="text-center text-blue-500 dark:text-gray-400 py-4">
                                                <p className="flex justify-center text-blue-500"><BeatLoader size={12} /></p>
                                            </td>
                                        </tr>
                                        // ) : paginatedData.length === 0 ? (
                                        ) : paginatedData.filter(cicl => cicl.children_case_type === "CICL").length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="font-serif text-center text-gray-500 dark:text-gray-400 py-4">
                                                    No data found
                                                </td>
                                            </tr>
                                        ) : ( 
                                        paginatedData
                                        .filter(cicl => cicl.children_case_type === "CICL")
                                        .map((cicl) => (
                                        <tr key={cicl.id} className="bg-white dark:bg-gray-800"> 
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.code_name}</td> 
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.locations}</td> 
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.age}</td> 
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.sex}</td>  
                                            {/* <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.religion}</td>   */}
                                            {/* <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.educational_attainment}</td>   */}
                                            {/* <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.educational_status}</td>   */}
                                            {/* <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.ethnic_affiliation}</td>   */}
                                            {/* <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.four_ps_beneficiary}</td>   */}
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.case}</td>  
                                            {/* <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.case_status}</td>   */}
                                            {/* <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.perpetrator}</td>   */}
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.interventions}</td>   
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                <button  onClick={() => handleViewClick(cicl)}   className="bg-white px-3 py-1 border rounded-md text-blue-500 hover:text-blue-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaEye /></button>
                                                <button  onClick={() => handleEditClick(cicl)}  className="bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
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
                        total={filteredCiclInfo.length}
                        onChange={handlePageChange}
                        showSizeChanger
                        onShowSizeChange={handlePageSizeChange}   
                        pageSizeOptions={['5', '10', '20', '50' , '100', '1000']}   
                    />
                </div> 
                <Modal show={openCreateModal}  size='7xl' onClose={() => setOpenCreateModal(false)}>
                    <Modal.Header>
                        <h1 className=''>Add CICL</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className='grid grid-cols-3 gap-5'> 
                                    <div>
                                        <label htmlFor="locations" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Location</label>
                                        <input type="text" name="locations" value={formData.locations} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    required/>
                                    </div>
                                    <div>
                                        <label htmlFor="code_name" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Code Name</label>
                                        <input type="text" name="code_name" value={formData.code_name} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    required/>
                                    </div>
                                    <div>
                                        <label htmlFor="age" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Age</label>
                                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-5'> 
                                    {/* <div>
                                        <label htmlFor="sex" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Children Case Type</label>
                                        <select name="children_case_type" value={formData.children_case_type} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="" className=' '>Select Case Type</option> 
                                            <option value="CICL" className=' '>Children in Conflict with the law (CICL)</option> 
                                            <option value="CAR" className=' '>Children at Risk(CAR)</option> 
                                            <option value="RC" className=' '>Rape Cases(RC)</option> 
                                            <option value="AC" className=' '>Abuse Cases(AC)</option> 
                                        </select>
                                    </div>  */}
                                    <div>
                                        <label htmlFor="sex" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Sex</label>
                                        <select name="sex" value={formData.sex} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                            <option value="" className=' '>Select Gender</option> 
                                            <option value="Male" className=' '>Male</option> 
                                            <option value="Female" className=' '>Female</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="religion" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Religion</label>
                                        <input type="text" name="religion" value={formData.religion} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    required/>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-5'> 
                                    <div>
                                        <label htmlFor="educational_attainment" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Educational Attainment</label>
                                        <input type="text" name="educational_attainment" value={formData.educational_attainment} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    required/>
                                    </div>
                                    <div>
                                        <label htmlFor="educational_status" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Educational Status</label>
                                        <select name="educational_status" value={formData.educational_status} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select Educational Status</option> 
                                            <option value="ISY" className=' '>ISY</option> 
                                            <option value="OSY" className=' '>OSY</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="ethnic_affiliation" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Ethnic Affiliation</label>
                                        <select name="ethnic_affiliation" value={formData.ethnic_affiliation} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select Ethnic Affiliation</option> 
                                            <option value="IP" className=' '>IP</option> 
                                            <option value="not_ip" className=' '>Not IP</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="four_ps_beneficiary" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">4Ps Beneficiary</label>
                                        <select name="four_ps_beneficiary" value={formData.four_ps_beneficiary} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select 4Ps Beneficiary</option> 
                                            <option value="four_ps" className=' '>4P's</option> 
                                            <option value="not_4ps" className=' '>Not 4P's</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="case" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Case</label>
                                        <input type="text" name="case" value={formData.case} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    required/>
                                    </div>
                                    <div>
                                        <label htmlFor="case_status" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Case Status</label>
                                        <select name="case_status" value={formData.case_status} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select Case Status</option> 
                                            <option value="on_going" className=' '>ON-GOING</option> 
                                            <option value="terminated" className=' '>TERMINATED</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="perpetrator" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Perpetrator</label>
                                        <input type="text" name="perpetrator" value={formData.perpetrator} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="interventions" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Interventions</label>
                                        <input type="text" name="interventions" value={formData.interventions} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                </div>   
                                <div className='flex justify-center'>
                                    <button type='submit'  disabled={loading}  className={` text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                            
                                        {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                                        </svg>
                                        ) : (
                                        <> 
                                             Submit
                                        </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal> 
                <Modal show={openViewReportModal}  size='5xl' onClose={() => setOpenViewReportModal(false)}>
                    <Modal.Header>
                        <h1>Report</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <CICL_Report />
                        <Age_Report />
                    </Modal.Body>
                </Modal>
                <Modal show={openEditModal}  size='5xl' onClose={() => setOpenEditModal(false)}>
                    <Modal.Header>
                        <h1>Edit CICL info</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleUpdate}>
                            <div className='grid grid-cols-3 gap-5'> 
                                <div>
                                    <label htmlFor="code_name" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Code Name</label>
                                    <input type="text" name="code_name" value={formData.code_name} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                </div>
                                <div>
                                    <label htmlFor="locations" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Locations</label>
                                    <input type="text" name="locations" value={formData.locations} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                </div>
                                <div>
                                    <label htmlFor="age" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Age</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                </div> 
                            </div>
                            <div className='grid grid-cols-2 gap-5'>
                                <div>
                                    <label htmlFor="sex" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Sex</label>
                                    <select name="sex" value={formData.sex} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                        <option value="" className=' '>Select Gender</option> 
                                        <option value="Male" className=' '>Male</option> 
                                        <option value="Female" className=' '>Female</option> 
                                    </select>
                                </div>  
                                <div>
                                    <label htmlFor="religion" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Religion</label>
                                    <input type="text" name="religion" value={formData.religion} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                </div>   
                                <div>
                                    <label htmlFor="educational_attainment" className="font-serif mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Educational Attainment</label>
                                    <input type="text" name="educational_attainment" value={formData.educational_attainment} onChange={handleInputChange} className="font-serif bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                </div>         <div>
                                        <label htmlFor="educational_status" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Educational Status</label>
                                        <select name="educational_status" value={formData.educational_status} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select Educational Status</option> 
                                            <option value="ISY" className=' '>ISY</option> 
                                            <option value="OSY" className=' '>OSY</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="ethnic_affiliation" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Ethnic Affiliation</label>
                                        <select name="ethnic_affiliation" value={formData.ethnic_affiliation} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select Ethnic Affiliation</option> 
                                            <option value="IP" className=' '>IP</option> 
                                            <option value="not_ip" className=' '>Not IP</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="four_ps_beneficiary" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">4Ps Beneficiary</label>
                                        <select name="four_ps_beneficiary" value={formData.four_ps_beneficiary} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select 4Ps Beneficiary</option> 
                                            <option value="four_ps" className=' '>4P's</option> 
                                            <option value="not_4ps" className=' '>Not 4P's</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="case" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Case</label>
                                        <input type="text" name="case" value={formData.case} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    required/>
                                    </div>
                                    <div>
                                        <label htmlFor="case_status" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Case Status</label>
                                        <select name="case_status" value={formData.case_status} onChange={handleInputChange} className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                            <option value="" className=' '>Select Case Status</option> 
                                            <option value="on_going" className=' '>ON-GOING</option> 
                                            <option value="terminated" className=' '>TERMINATED</option> 
                                        </select>
                                    </div> 
                                    <div>
                                        <label htmlFor="perpetrator" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Perpetrator</label>
                                        <input type="text" name="perpetrator" value={formData.perpetrator} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                    <div>
                                        <label htmlFor="interventions" className=" mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Interventions</label>
                                        <input type="text" name="interventions" value={formData.interventions} onChange={handleInputChange} className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                </div>
                                <div className='mt-4 flex justify-end'>
                                    <Button type='submit'>Submit</Button>      
                                </div>              
                        </form>
                    </Modal.Body>
                </Modal>
                <Modal show={openViewModal}  size='5xl' onClose={() => setOpenViewModal(false)}>
                    <Modal.Header>
                        <h1>Personal Info</h1>
                    </Modal.Header>
                    <Modal.Body>
                            {selectedPersonalInfo && (
                                  <div className="bg-gray-100 rounded-lg p-6 shadow-md dark:bg-gray-700 border border-gray-300 dark:border-gray-500">
                                    <div className="flex flex-col gap-4"> 
                                      <div className="grid grid-cols-3 gap-4 border-b pb-2 dark:border-gray-500">
                                        <div className="">
                                            <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Location</p>
                                            <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.locations}</p>
                                        </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Code Name</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.code_name}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Age</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.age}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Sex</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.sex}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Religion</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.religion}</p>
                                          </div>
                                      </div> 
  
                                      <div className="grid grid-cols-3 gap-4">
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Educational Attainment</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.educational_attainment}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Educational Status</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.educational_status}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Ethnic Affiliation</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.ethnic_affiliation}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">4Ps Beneficiary</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.four_ps_beneficiary}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Case</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.case}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Case Status</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.case_status}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Perpetrator</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.perpetrator}</p>
                                          </div>
                                          <div>
                                              <p className="font-serif text-sm text-gray-600 dark:text-gray-200">Interventions</p>
                                              <p className="font-serif font-semibold text-gray-800 dark:text-gray-200">{selectedPersonalInfo.interventions}</p>
                                          </div>
                                      </div> 
  
                                  </div>
                              </div>
                            )}
                    </Modal.Body>
                    <Modal.Footer className="flex justify-end">
                        <Button onClick={() => setOpenViewModal(false)} className="font-serif bg-red-600 text-white rounded-md hover:bg-red-700 transition-all dark:bg-red-500">
                            Close
                        </Button>
                        <Button  onClick={() => handleEditClick(selectedPersonalInfo)} className="font-serif   text-white rounded-md   transition-all ">
                            Edit
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={openImportModal} size='md' onClose={() => setOpenImportModal(false)}>
                    <Modal.Header>
                        <h1>Import File</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="flex flex-col space-y-4">
                            <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} className="border p-2 rounded dark:border-gray-500" />
                           
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
            </div> 
        </div>
    );
};

export default CICL_Info;
