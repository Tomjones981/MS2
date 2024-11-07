import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../api/axiosClient';
import { Modal } from 'flowbite-react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert'; 
import Slide from '@mui/material/Slide';

import { useNavigate } from 'react-router-dom';

 
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
const Create_Fac = () => { 
    const [open, setOpen] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const vertical = "top";
    const horizontal = "right";
    const navigate = useNavigate();
    const [error, setError] = useState(""); 
    const [errorWeek, setErrorWeek] = useState(""); 
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        department_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        faculty_type:'',
        phone_number: '',
        email: '',
        employment_type: '',
        start_date: '',
        end_date: '', 
        note: '',
        rate_type: '',
        description: '',
        rate_value: '',
        subjects: '',
        teaching_units: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: ''
    });

    useEffect(() => {
        axiosClient.get('/departments')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the departments!', error);
            });
    }, []);

    


        const handleClose = (event, reason) => {
            if (reason === "clickaway") {
            return;
            }
            setOpen(false);
        };
    
        function TransitionLeft(props) {
            return <Slide {...props} direction="left" />;
        }


       const handleSubmit = (e) => {
            e.preventDefault();

            const totalUnits =
                parseFloat(formData.monday || 0) +
                parseFloat(formData.tuesday || 0) +
                parseFloat(formData.wednesday || 0) +
                parseFloat(formData.thursday || 0) +
                parseFloat(formData.friday || 0) +
                parseFloat(formData.saturday || 0);

            if (totalUnits !== parseFloat(formData.teaching_units)) {
                setErrorWeek(`Total units must be exactly ${formData.teaching_units}. Currently: ${totalUnits}`);
                return;
            }

            const rateValue = parseFloat(formData.rate_value);
            if (isNaN(rateValue) || rateValue < 150 || rateValue > 350) {
                setError("Please enter a valid rate value between 150 and 350.");
                return;  
            }

            setLoading(true);
            axiosClient.post('/create-faculty', formData)
                .then(response => {
                    console.log('Faculty created:', response.data); 
                    setSnackbarMessage("Faculty created successfully!");
                    setSnackbarSeverity("success");
                    setOpen(true);
                    setFormData({  
                        department_id: '',
                        first_name: '',
                        middle_name: '',
                        last_name: '',
                        faculty_type: '',
                        phone_number: '',
                        email: '',
                        employment_type: '',
                        start_date: '',
                        end_date: '', 
                        note: '',
                        rate_type: '',
                        description: '',
                        rate_value: '',
                        subjects: '',
                        teaching_units: '',
                        monday: '',
                        tuesday: '',
                        wednesday: '',
                        thursday: '',
                        friday: '',
                        saturday: ''
                    }); 
                })
                .catch(error => {
                    console.error('There was an error creating the faculty!', error);
                    setSnackbarMessage("There was an error creating the faculty!");
                    setSnackbarSeverity("error");
                    setOpen(true);
                })
                .finally(() => {
                    setLoading(false); 
                });
        };
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    
        if (id === "rate_value") {
            const rateValue = parseFloat(value);
            if (isNaN(rateValue) || rateValue < 150 || rateValue > 350) {
                setError("The minimum amount is 150 and the maximum amount is 350");
            } else {
                setError("");
            }
        }
    };
 
useEffect(() => {
    const totalUnits =
        parseFloat(formData.monday || 0) +
        parseFloat(formData.tuesday || 0) +
        parseFloat(formData.wednesday || 0) +
        parseFloat(formData.thursday || 0) +
        parseFloat(formData.friday || 0) +
        parseFloat(formData.saturday || 0);

    if (totalUnits !== parseFloat(formData.teaching_units)) {
        setErrorWeek(`Total units must be exactly ${formData.teaching_units}. Currently: ${totalUnits}`);
    } else {
        setErrorWeek("");
    }
}, [
    formData.monday,
    formData.tuesday,
    formData.wednesday,
    formData.thursday,
    formData.friday,
    formData.saturday,
    formData.teaching_units
]);

    return (
        <div className='mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
            <h1 className="mb-5 font-semibold text-xl dark:text-white uppercase">Register Faculty</h1>
            <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '105%' }} />
            <form onSubmit={handleSubmit}>
                <div className="border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-md dark:shadow-xl p-6">
                    <h1 className="mb-5 font-semibold text-md dark:text-white uppercase underline">Faculty Info</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5'>
                    <div>
                        <label htmlFor="department_id" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Select Department
                        </label>
                        <select
                            id="department_id"
                            name="department_id"
                            value={formData.department_id}  
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.department_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        <div>
                            <label htmlFor="first_name" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
                            <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="First Name" required />
                        </div>
                        <div>
                            <label htmlFor="middle_name" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Middle name</label>
                            <input type="text" id="middle_name" value={formData.middle_name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Middle Name" required />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
                            <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Last Name" required />
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        <div>
                            <label htmlFor="phone_number" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                            <input type="number" id="phone_number" value={formData.phone_number} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Phone #" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
                        </div>
                        <div>
                            <label htmlFor="faculty_type" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Faculty Type</label>
                            <select id="faculty_type" value={formData.faculty_type} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                <option value="">Select Faculty Type</option>
                                <option value="department_head">Department Head</option>
                                <option value="faculty">Faculty</option> 
                            </select>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-md dark:shadow-xl p-6">
                    <h1 className="mb-5 font-semibold text-md dark:text-white uppercase underline">Employment Info</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                        <div>
                            <label htmlFor="employment_type" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employment Type</label>
                            <select id="employment_type" value={formData.employment_type} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Select Employment Type</option>
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="terminated">Terminated</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="start_date" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                            <input type="date" id="start_date" value={formData.start_date} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="end_date" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                            <input type="date" id="end_date" value={formData.end_date} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="note" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Note</label>
                            <textarea type="text" id="note" value={formData.note} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Input Notes' required/>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-md dark:shadow-xl p-6">
                    <h1 className="mb-5 font-semibold text-md dark:text-white uppercase underline">Rate Info</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        <div>
                            <label htmlFor="rate_type" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rate Type</label>
                            <select id="rate_type" value={formData.rate_type} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                <option value="">Select Rate Type</option>
                                <option value="baccalaureate">Baccalaureate</option>
                                <option value="master">Master</option> 
                                <option value="doctor">Doctor</option> 
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rate_value" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rate Value</label>
                            <input type="number" id="rate_value" value={formData.rate_value} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Rate Value" />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                        <div>
                            <label htmlFor="description" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea type="text" id="description" value={formData.description} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description" required/>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-md dark:shadow-xl p-6">
                    <h1 className="mb-5 font-semibold text-md dark:text-white uppercase underline">Teaching Units</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        <div>
                            <label htmlFor="subjects" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subjects</label>
                            <input type="number" id="subjects" value={formData.subjects} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Teaching Units" />
                        </div>
                        <div>
                            <label htmlFor="teaching_units" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Teaching Units</label>
                            <input type="number" id="teaching_units" value={formData.teaching_units} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Teaching Units" />
                        </div>
                    </div> 
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-md mt-2 shadow-md dark:shadow-xl p-6">
                    <h1 className="mb-5 font-semibold text-md dark:text-white uppercase underline">Week Days Units</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6   gap-5'>
                        <div>
                            <label htmlFor="monday" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monday</label>
                            <input type="number" id="monday" value={formData.monday} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="no. of units" />
                        </div>
                        <div>
                            <label htmlFor="tuesday" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tuesday</label>
                            <input type="number" id="tuesday" value={formData.tuesday} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="no. of units" />
                        </div>
                        <div>
                            <label htmlFor="wednesday" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Wednesday</label>
                            <input type="number" id="wednesday" value={formData.wednesday} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="no. of units" />
                        </div>
                        <div>
                            <label htmlFor="thursday" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thursday</label>
                            <input type="number" id="thursday" value={formData.thursday} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="no. of units" />
                        </div>
                        <div>
                            <label htmlFor="friday" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Friday</label>
                            <input type="number" id="friday" value={formData.friday} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="no. of units" />
                        </div>
                        <div>
                            <label htmlFor="saturday" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Saturday</label>
                            <input type="number" id="saturday" value={formData.saturday} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="no. of units" />
                        </div>
                    </div>
                    {errorWeek && <p className="text-red-500 text-sm mt-2">{errorWeek}</p>}
                </div>
                

                <div className='flex items-center justify-end mt-6'>
                    <button type="submit" className={`text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading} > {loading ? 'Creating...' : 'Create Faculty'} </button>
                </div>
            </form>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} TransitionComponent={TransitionLeft}>
                <Alert onClose={handleClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
          </div>
    );
};

export default Create_Fac;
