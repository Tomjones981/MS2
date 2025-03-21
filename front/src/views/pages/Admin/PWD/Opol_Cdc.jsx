 
import React, { useEffect, useState } from 'react';
import { FiMoreVertical, FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import axiosClient from '../../../../api/axiosClient';
import { FaEye, FaRegEdit } from "react-icons/fa"; 
import { DatePicker, message, Pagination } from 'antd'; 
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { debounce } from "lodash";

const Opol_Cdc = () => {
    const { SubCatId } = useParams();
    const navigate = useNavigate();
    
    const [subCatInfo, setSubCatInfo] = useState({
        sub_cat_name: "",
        age_range: "",
        description: ""
    });

    const [ciclInfo, setCiclInfo] = useState([]);
    const [loading, setLoading] = useState(false); 
    
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
        });
        setOpenCreateModal(true);
    }; 
     
     
    
    

    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
        setCurrentPage(1);
    } 
                // useEffect(() => {
                //     if (SubCatId) {
                //         fetchsubCatNames(SubCatId);
                //         fetchCiclInfo(SubCatId);
                //         fetchCICLLocations();
                //         fetchCICLSex();
                //         fetchCICLAge();
                //     }
                // }, [SubCatId]);
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
    return (
        <div className='p-5'>
            <div className='mt-2 w-full p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                 
                <div className='flex justify-between items-center p-2 mb-2 -mt-3 dark:bg-gray-800'>
                    <button onClick={() => navigate(-1)} className='shadow-xl -ml-[3rem] -mr-[38rem] border border-gray-200 bg-gray-600 flex items-center gap-2 p-2 text-gray-200 rounded-md font-bold text-xl transition-all hover:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                        <ReplyAllIcon className='text-2xl  ' /> 
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 font-serif dark:text-gray-200">
                        <span className="text-blue-600 font-serif underline"> 
                            {subCatInfo.sub_cat_name || "Loading..."}{" "} 
                            {subCatInfo.age_range || "Loading..."}{" "} 
                        </span> Category
                    </h1>
                    <div className="flex space-x-2 -mt-1"> 
                        <button onClick={() => setOpenMenu(!openMenu)} className="p-2 rounded-full bg-gray-600 text-white shadow-md hover:bg-gray-500 transition">
                            <FiMoreVertical className="text-xl" />
                        </button>

                        {openMenu && (
                            <div className=' '>
                                <div className='absolute right-[5rem] mt-10  flex gap-5 w-[30rem] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10'> 
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
                <div className='grid grid-cols-12 mt-6 mb-2   '>  
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
                <div className='h-[23rem] mt-5'>  
                        <div className="max-h-[20rem] overflow-y-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
                            <table className="w-full">
                                <thead className='text-gray-800 sticky -top-1 bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200'>
                                    <tr className=""> 
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Code Name</th>  
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Location</th>  
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Age</th>   
                                        <th className=" p-3 text-sm font-semibold tracking-wide text-left uppercase">Sex</th>   
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
                                        ) : paginatedData.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="font-serif text-center text-gray-500 dark:text-gray-400 py-4">
                                                    No data found
                                                </td>
                                            </tr>
                                        ) : ( 
                                        paginatedData.map((cicl) => (
                                        <tr key={cicl.id} className="bg-white dark:bg-gray-800"> 
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.locations}</td> 
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.code_name}</td> 
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.age}</td>  
                                            <td className=" p-3 text-sm text-gray-700   dark:text-gray-200">{cicl.sex}</td>  
                                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex space-x-2">
                                                <button    className="bg-white px-3 py-1 border rounded-md text-blue-500 hover:text-blue-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaEye /></button>
                                                <button   className="bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 dark:bg-gray-800 transform scale-100 hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
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
            </div> 
        </div>
    );
};

export default Opol_Cdc;
