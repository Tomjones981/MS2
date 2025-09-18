import React, { useEffect, useState } from 'react'
import {FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../../api/axiosClient';
import { FaFolderOpen } from "react-icons/fa";  
import {   FaRegEdit } from "react-icons/fa";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { Button, Modal } from 'flowbite-react';
import { message, Pagination } from 'antd'
const Sub_Category = () => {
    const { sectorId } = useParams();
    const [sectorName, setSectorName] = useState("");
    const [subCategories, setSubCategories] = useState ([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Sector ID:", sectorId);
        if (sectorId) {
            fetchBrgySectorName(sectorId);
            fetchSubCategories(sectorId); 
        }
    }, [sectorId]);

    const fetchSubCategories = async (sectorId) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/sub-category/${sectorId}`);
            setSubCategories(response.data);
        } catch (error) {
            console.error("Error fetching Sub Categories:", error);
        }
        setLoading(false);
    };

    const fetchBrgySectorName = async (sectorId) => {
        try {
            const response = await axiosClient.get(`/brgy-sectors/sub-category/${sectorId}`);  
            setSectorName(response.data.sector_name);
        } catch (error) {
            console.error("Error fetching year date:", error);
        }
    };

    const navigate = useNavigate();
    // const handleView = (SubCatId) => {
    //     navigate(`/brgy-sectors/sub-category/personal-info/${SubCatId}`);
    // };

    const handleView = (subCatId, subCatName) => {
        if (subCatName === "ENROLLEES") {
            navigate(`/brgy-sectors/sub-category/opol-cdc/${subCatId}`);
        } else if (subCatName === "ECCD") {
            navigate(`/brgy-sectors/sub-category/opol-eccd/${subCatId}`); 
        }else if(subCatName === "PWD") {
            navigate(`/brgy-sectors/sub-category/personal-info/${subCatId}`);
          }
         else {
            navigate(`/brgy-sectors/sub-category/all/${subCatId}`);
        }
    };
    
    


    const [errors, setErrors] = useState({});
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [formData, setFormData] = useState ({
        sub_cat_name: "",
        age_range: "",
        description: "",
    });
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleOpenCreateCategory = async (e) => {
        setFormData({ 
            sub_cat_name: "",
            age_range: "",
            description: "",
        });
        setOpenCreateModal(true);
    }  

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setErrors({});  
    
        try {
            const response = await axiosClient.post('/sub-category-create', {
                brgy_sector_id : sectorId,
                ...formData
            });
    
            console.log("Success:", response.data);
            message.success("Successfully Created"); 
            setFormData({ 
                sub_cat_name: '',
                age_range: '',
                description: '',
            });
            fetchSubCategories(sectorId);
     
            setOpenCreateModal(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) { 
                    setErrors(error.response.data.errors);
                    Object.values(error.response.data.errors).forEach((errorMessages) => {
                        message.error(errorMessages[0]); // Display the first error message
                    });
                }
                 else if (error.response.status === 409) { 
                    message.error(error.response.data.message);
                } else {
                    console.error("Error Creating Category info:", error);
                    message.error("Error Creating Category Info.");
                }
            } else {
                console.error("Unexpected Error:", error);
                message.error("Something went wrong.");
            }
        }
    };

  return (
    <div className='p-5'>
        <div className='mt-1 w-full p-5 bg-white border border-gray-200 rounded-lg  dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex justify-between items-center p-2 mb-2 -mt-3       dark:bg-gray-800'>
                <button onClick={() => navigate(-1)} className='shadow-xl -ml-[3rem] -mr-[43rem] border border-gray-200 bg-gray-600 flex items-center gap-2 p-2 text-gray-200 rounded-md font-bold text-xl transition-all hover:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-700'>
                    <ReplyAllIcon className='text-2xl  ' /> 
                </button>
                <h1 className="text-lg font-semibold text-gray-900 font-light dark:text-gray-200">
                    <span className="text-blue-600 font-light underline">{sectorName || "Loading..."}'s</span> {" "} 
                    Sector 
                </h1>
                <div className="flex space-x-2 -mt-1"> 
                    <button  type='button' onClick={() => handleOpenCreateCategory(true)} className="font-light flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg -md hover:bg-green-700 transition">
                        <FiPlus className="text-lg" />
                            Add  
                    </button>
                </div>
            </div>
            <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>
            
            <div className='grid grid-cols-10 mt-6 mb-2 gap-4 '> 
                <div className='col-span-7'> 
                     <select name=""    className='h-9 font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                        <option value="" className='font-light'>All</option> 
                    </select>
                </div>
                <div className="relative col-span-3 flex items-end">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none mt-6">
                        <svg className="mb-5 w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search"   className="font-light block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search name" />
                </div>
            </div>
            
            <div className='h-[40rem] mt-5'>
                <div className='max-h-[37rem] overflow-y-auto rounded-lg  border border-gray-200 dark:border-gray-700 '>
                    <table className='w-full'>
                        <thead className='text-gray-800 sticky -top-1 bg-gray-50 dark:bg-gray-200 border-b-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200'>
                            <tr>
                                <th className='font-light w-20 p-3 text-sm font-semibold whitespace-nowrap tracking-wide text-left'>Sub Category Name</th>
                                <th className='font-light w-20 p-3 text-sm font-semibold tracking-wide text-left'>Age Range</th>
                                <th className='font-light w-20 p-3 text-sm font-semibold tracking-wide text-center'> Description</th>
                                <th className='font-light w-20 p-3 text-sm font-semibold tracking-wide text-center'> Actions</th> 
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800'>
                            {loading ? (
                                <div class="mx-auto w-full max-w-500 rounded-md   p-4">
                                    <div class="flex animate-pulse space-x-4">
                                        <div class="size-10 rounded-full bg-gray-200"></div>
                                        <div class="flex-1 space-y-6 py-1">
                                        <div class="h-2 rounded bg-gray-200"></div>
                                        <div class="space-y-3">
                                            <div class="grid grid-cols-3 gap-4">
                                            <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                                            <div class="col-span-1 h-2 rounded bg-gray-200"></div>
                                            </div>
                                            <div class="h-2 rounded bg-gray-200"></div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            ) : subCategories.length > 0 ? (
                                subCategories.map((subcat) => (
                                        <tr key={subcat.id} className='bg-white dark:bg-gray-800'>
                                            <td className='font-light p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200'>{subcat.sub_cat_name}</td>
                                            <td className='font-light p-3 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200'>{subcat.age_range}</td>
                                            <td className='font-light p-3 text-sm text-gray-700 text-center whitespace-nowrap dark:text-gray-200'>{subcat.description}</td>
                                            <td className='p-3 text-sm text-gray-700 whitespace-nowrap flex justify-center space-x-2'> 
                                                <button onClick={() => handleView(subcat.id, subcat.sub_cat_name)}
                                                // onClick={() => handleView(subcat.id)} 
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md transform scale-100 hover:scale-110 transition-all duration-300">
                                                    <FaFolderOpen />
                                                </button> 
                                                <button className=" bg-white px-3 py-1 border rounded-md text-green-500 hover:text-green-700 transform scale-100 hover:scale-110 transition-all duration-300"><FaRegEdit /></button>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                               <div>
                                 <p className='font-light text-center justify-center'>No sub category available for this sector.</p>
                               </div>
                            )}
                        </tbody>
                    </table>
                </div> 
            </div>
            
            <Modal show={openCreateModal} size='xl' onClose={() => setOpenCreateModal(false)}>
                <Modal.Header>
                    <h1 className='font-light'>Add Category</h1>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={handleCreateCategory}> 
                            <div>
                                <label htmlFor="sub_cat_name" className="font-light mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Category Name</label>
                                <input type="text" name="sub_cat_name" value={formData.sub_cat_name} onChange={handleInputChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                            </div>
                            <div>
                                <label htmlFor="age_range" className="font-light mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Age Range</label>
                                <input type="text" name="age_range" value={formData.age_range}  onChange={handleInputChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                            </div>
                            <div>
                                <label htmlFor="description" className="font-light mt-2 block mb-1  text-md font-medium text-gray-900 dark:text-white">Description</label>
                                <input type="text" name="description" value={formData.description}  onChange={handleInputChange} className="font-light bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=" ......"    />
                            </div>
                            <div className=' mt-5 flex justify-end'>
                                <Button type="submit" className=''>Create</Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    </div>
  )
}

export default Sub_Category