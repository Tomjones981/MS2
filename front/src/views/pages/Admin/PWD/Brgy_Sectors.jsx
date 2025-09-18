
import React, { useState, useEffect } from "react";
import axiosClient from "../../../../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import {FiPlus } from "react-icons/fi";
import { FaFolderOpen } from "react-icons/fa"; 
import { Modal  } from "flowbite-react";
import {message} from 'antd'
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

const Brgy_Sectors = () => {
    const { yearId  } = useParams(); 
    const [errors, setErrors] = useState({});
    const [sectors, setSectors] = useState([]);
    const [yearDate, setYearDate] = useState("");
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        if (yearId) {
            fetchSectors(yearId);
            fetchYearDate(yearId);
        }
    }, [yearId]);

    const fetchSectors = async (yearId) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/brgy-sectors/${yearId}`);
            setSectors(response.data);
        } catch (error) {
            console.error("Error fetching sectors:", error);
        }
        setLoading(false);
    };

    const fetchYearDate = async (yearId) => {
        try {
            const response = await axiosClient.get(`/brgy-sectors/years/${yearId}`);  
            setYearDate(response.data.year_date);
        } catch (error) {
            console.error("Error fetching year date:", error);
        }
    };

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [formData, setFormData] = useState({
            sector_name: '',
    });
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});  
    
        try {
            const response = await axiosClient.post('/brgy-sectors-create', {
                year_id: yearId,
                ...formData
            });
    
            console.log("Success:", response.data);
            message.success("Successfully Created");
     
            setFormData({ sector_name: "" });
            fetchSectors(yearId);
     
            setOpenCreateModal(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) { 
                    setErrors(error.response.data.errors);
                    if (error.response.data.errors?.sector_name?.includes("Sector name already exists.")) {
                        message.error("Sector name already exists.");
                    }
                } else if (error.response.status === 409) { 
                    message.error(error.response.data.message);
                } else {
                    console.error("Error Creating sector info:", error);
                    message.error("Error Creating Info.");
                }
            } else {
                console.error("Unexpected Error:", error);
                message.error("Something went wrong.");
            }
        }
    };
    
    
    

    const navigate = useNavigate();
    const handleView = (sectorId) => {
        navigate(`/brgy-sectors/sub-category/${sectorId}`);
    };

    return ( 
        <div className="p-5">
            <div className="mt-1 w-full p-5 bg-white border border-gray-200 rounded-lg  dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center p-2 mb-2 -mt-3 dark:bg-gray-800">
                    <button onClick={() => navigate(-1)} className='-xl -ml-[3rem] -mr-[43rem] border border-gray-200 bg-gray-600 flex items-center gap-2 p-2 text-gray-200 rounded-md font-bold text-xl transition-all hover:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                        <ReplyAllIcon className='text-2xl  ' /> 
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 font-light dark:text-gray-200">
                         Sectors List in{" "}
                        <span className="text-blue-600 font-light underline">{yearDate || "Loading..."}</span>
                    </h1>

                    <div className="flex space-x-2 -mt-1"> 
                        <button onClick={() => setOpenCreateModal(true)} type='button' className="font-light flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg -md hover:bg-green-700 transition">
                            <FiPlus className="text-lg" />
                            Add  
                        </button>
                    </div>
                </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>
                <div className="  gap-5">
                    <div>
                        {loading ? (
                            <div className="mx-auto w-full max-w-[20] rounded-md p-4">
                                <div className="flex animate-pulse space-x-4">
                                    <div className="size-10 rounded-full bg-gray-200"></div>
                                    <div className="flex-1 space-y-6 py-1">
                                        <div className="h-2 rounded bg-gray-200"></div>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                                                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                                            </div>
                                            <div className="h-2 rounded bg-gray-200"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : sectors.length > 0 ? (
                            <ul className="mt-4 grid grid-cols-2 gap-4">
                                {sectors.map((sector) => (
                                    <li key={sector.id} className="font-light flex justify-between p-3 bg-gray-200 rounded-md">
                                        {sector.sector_name}
                                        <button
                                            onClick={() => handleView(sector.id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md transform scale-100 hover:scale-110 transition-all duration-300"
                                        >
                                            <FaFolderOpen />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No sectors available for this year.</p>
                        )}
                    </div>
                </div>


                <Modal show={openCreateModal} size='sm' onClose={() => setOpenCreateModal(false)} >
                    <Modal.Header>
                        <h1 className="font-light">Create Sector</h1>
                    </Modal.Header>
                    
                    <Modal.Body>
                            <form  onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label htmlFor="sector_name" className="font-light mt-2 block text-md font-medium text-gray-900 dark:text-white">Sector Name</label>
                                        <input type="text" name="sector_name" value={formData.sector_name} onChange={handleInputChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                                    </div>
                                </div>
                                
                                <div className='flex justify-center'>
                                <button type="submit" disabled={loading}  className={`mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-light ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                            
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
            </div>
        </div>
    );
};

export default Brgy_Sectors;
