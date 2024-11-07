import React, { useState, forwardRef, useEffect } from "react";
import axiosClient from "../../../../api/axiosClient";
import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { BeatLoader } from 'react-spinners' 
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Add_Dept = () => {
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [headName, setHeadName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);  
    const [searchQuery, setSearchQuery] = useState('');

    const vertical = "top";
    const horizontal = "right";

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/get_department');
            setDepartments(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching departments:", error.response?.data || error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                const response = await axiosClient.put(`/update_department/${editingId}`, {
                    department_name: departmentName, 
                });

                setSnackbarMessage(response.data.message);
            } else {
                const response = await axiosClient.post('/create_department', {
                    department_name: departmentName, 
                });
                setSnackbarMessage(response.data.message);
            }
            setSnackbarSeverity("success");
            fetchDepartments();
            resetForm();
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setSnackbarMessage("This department name already exists!");
                setSnackbarSeverity("error");
            } else {
                setSnackbarMessage("An error occurred. Please try again.");
                setSnackbarSeverity("error");
            }
        } finally {
            setLoading(false);
            setOpen(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                const response = await axiosClient.delete(`/delete_department/${id}`);
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity("success");
                fetchDepartments();
            } catch (error) {
                console.error("Error deleting department:", error.response?.data || error.message);
                setSnackbarMessage("An error occurred while deleting the department.");
                setSnackbarSeverity("error");
            } finally {
                setOpen(true);
            }
        }
    };

    const resetForm = () => {
        setDepartmentName('');
        setHeadName('');
        setContactInfo('');
        setEditingId(null);
    };

    const handleEdit = (department) => {
        setDepartmentName(department.department_name); 
        setEditingId(department.id);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    const filteredDepartments = departments.filter(department => 
        department.department_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    function TransitionLeft(props) {
        return <Slide {...props} direction="left" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="col-span-3 mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h1 className="uppercase mb-5 font-semibold text-xl dark:text-white">Add Department</h1>
                <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: "120%" }} />
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-col-1 gap-4">
                        <div>
                            <label htmlFor="dept-name-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department Name:</label>
                            <input type="text" id="dept-name-input" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Dept. Name" required />
                        </div>  
                        <div className="flex justify-center items-center">
                            <button type="submit" disabled={loading} className={`hover:scale-110 flex justify-center items-center  gap-2 text-white bg-gradient-to-br from-gray-600 to-blue-900 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-11 py-2.5 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        Save Department
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} TransitionComponent={TransitionLeft}>
                    <Alert onClose={handleClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>

            <div className="col-span-7 mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h1 className="uppercase mb-5 font-semibold text-xl dark:text-white">Manage Department</h1>
                <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: "107%" }} />

                <div className="flex justify-center items-center">
                    <div className="m-3 w-full">
                        <div className="flex items-center justify-between mb-4 ">
                            <div>
                                <select name="designationFilter" className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="">All</option>
                                </select>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none ">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search"  placeholder="Search by Department Name"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)} className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                            </div>
                        </div>
                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="max-h-[20rem] overflow-y-auto">  
                            <table className=" table-auto w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                    <thead className="sticky top-0 text-xs text-gray-200 uppercase bg-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">ID</th>
                                            <th scope="col" className="flex justify-center items-center px-6 py-3">Department Name</th> 
                                            <th scope="col" className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center p-4">
                                            <div className="flex justify-center items-center">
                                                <BeatLoader loading={loading} color="#0000FF" />
                                            </div>
                                            </td>
                                        </tr>
                                        ) : (
                                         filteredDepartments.map((department) => (
                                            <tr key={department.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-6 py-4">{department.id}</td>
                                                <td className="flex justify-center items-center px-6 py-4">{department.department_name}</td> 
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleEdit(department)} className="bg-gradient-to-br from-gray-600 to-blue-900 hover:bg-gradient-to-bl text-white font-bold py-1 px-2 rounded">
                                                            <AiOutlineEdit size={24} />
                                                        </button>
                                                        <button onClick={() => handleDelete(department.id)} className="bg-gradient-to-br from-gray-600 to-red-400 hover:bg-gradient-to-bl text-white font-bold py-1 px-2 rounded ml-2">
                                                            <AiOutlineDelete size={24} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                         ))
                                        )}
                                    </tbody>
                                </table>
                                {filteredDepartments.length === 0 && (
                            <p className="mt-4 text-center text-gray-500 dark:text-gray-300">No departments found.</p>
                            )}
                            </div>
                        </div>
                    </div>
                </div> 
            </div>

        </div>
    );
};

export default Add_Dept;
