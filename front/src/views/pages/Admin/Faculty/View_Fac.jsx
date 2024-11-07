import React, { useEffect, useState, forwardRef } from "react";
import axiosClient from "../../../../api/axiosClient";
import Logo from "../../../../assets/images/employee.png";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "flowbite-react";
import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom"; 
import LoadingScreen from "../../../components/LoadingScreen";
const anchorOrigin = { vertical: 'top', horizontal: 'right' };
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const View_Fac = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const { id } = useParams();
  const [faculty, setFaculty] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const vertical = "top";
  const horizontal = "right";
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",  
    faculty_type: "",
    department_id: "",
    employment_type: "",
    start_date: "",
    end_date: "",
    status: "",
    rates: "",
    rate_type: "",
    rate_value: "",
    phone_number: "",
    email: "",
    subjects: "",
    teaching_units: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: ""
  });

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }
  useEffect(() => { 
    const fetchDepartments = async () => {
      try {
        const response = await axiosClient.get('/departments');  
        setDepartments(response.data);  
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    axiosClient.get(`/faculty/${id}`)
      .then(response => {
        setFaculty(response.data);
        setFormData({
          first_name: response.data.first_name,
          middle_name: response.data.middle_name,
          last_name: response.data.last_name,
          faculty_type: response.data.faculty_type,
          department_id: response.data.department_id  || "",
          employment_type: response.data.employment_type || "", 
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          status: response.data.status,
          rate_type: response.data.rate_type, 
          rate_value: response.data.rate_value, 
          phone_number: response.data.phone_number,
          email: response.data.email,
          subjects: response.data.subjects,
          teaching_units: response.data.teaching_units,
          monday: response.data.monday,
          tuesday: response.data.tuesday,
          wednesday: response.data.wednesday,
          thursday: response.data.thursday,
          friday: response.data.friday,
          saturday: response.data.saturday,
        });
      })
      .catch(error => {
        console.error("There was an error fetching the faculty data!", error);
        setError("Faculty not found");
      });
  }, [id]);

  const handleEdit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate(`/view_faculty/${id}`);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [id]: value
    }));
};
const prepareRates = (rates) => {
  return Array.isArray(rates) ? rates : [];  
};
const handleSubmit = (event) => {
  event.preventDefault();
  setLoading(true);  

  try {
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    const rates = prepareRates(formData.rates || []);
    data.append('rates', JSON.stringify(rates));

    if (file) {
      data.append("file", file);
    }

    axiosClient
      .post(`/faculties/${id}`, data)
      .then((response) => {
        setLoading(false);
        setSnackbarMessage("Faculty updated successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
 
        navigate("/faculty");  
 
        axiosClient.get(`/faculty/${id}`)
          .then(response => {
            setFaculty(response.data);
            setFormData({
              first_name: response.data.first_name,
              middle_name: response.data.middle_name,
              last_name: response.data.last_name,
              faculty_type: response.data.faculty_type,
              department_id: response.data.department_id || "",
              employment_type: response.data.employment_type || "",
              start_date: response.data.start_date,
              end_date: response.data.end_date,
              status: response.data.status,
              rate_type: response.data.rate_type,
              rate_value: response.data.rate_value,
              phone_number: response.data.phone_number,
              email: response.data.email,
              subjects: response.data.subjects,
              teaching_units: response.data.teaching_units,
              monday: response.data.monday,
              tuesday: response.data.tuesday,
              wednesday: response.data.wednesday,
              thursday: response.data.thursday,
              friday: response.data.friday,
              saturday: response.data.saturday,
            });
          });

        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        setSnackbarMessage(
          error.response?.data?.message || "Failed to update faculty."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  } catch (error) {
    setLoading(false);
    setSnackbarMessage("An unexpected error occurred.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
};


  if (loading) {
    return <div><LoadingScreen/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-2 flex flex-col items-center p-4 border border-gray-200 bg-white rounded-md dark:bg-gray-800 dark:border-gray-700 shadow-md">
            <div className="mt-4 flex flex-col items-center border border-gray-200 p-4 mb-4 rounded-md dark:bg-gray-800 dark:border-gray-700">
              <img className="w-36 h-36 mb-4" src={Logo} alt="FACULTY PROFILE" />
              <div className="text-center">
                <h1 className="font-bold text-lg dark:text-gray-300"> {faculty.first_name} {faculty.middle_name} {faculty.last_name} </h1>
                <h2 className="text-sm dark:text-gray-200">Ph: +63{faculty.phone_number}</h2>
                <h2 className="text-sm underline dark:text-gray-200"> {" "} emp@test.com{" "} </h2>
              </div>
            </div>
            <div className="w-full">
              <ul className="flex flex-col items-start">
                <a href="" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-500 font-semibold mt-4 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase" > {" "} Personal Info{" "} </a>
                <a href="" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase" > <Link to={`/sched_info/${id}`}>Schedule Info</Link> </a>
                <a href="" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase" > {" "} Attendance Info{" "} </a>
                <a href="" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase" > {" "} Bank Account Details{" "} </a>
                <a href="" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase" > {" "} Documents{" "} </a>
              </ul>
            </div>
          </div>
         
          <div className="col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
            <h1 className="mb-5 font-semibold text-xl dark:text-white uppercase">Personal Information</h1>
            <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-700" style={{ width: '107.5%' }}/>

            <div className="space-y-6">

              
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Full Name:</span>
                  <p>{faculty.first_name} {faculty.middle_name} {faculty.last_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Employee Type:</span>
                  <p>{faculty.faculty_type === "department_head" ? "Department Head" : faculty.faculty_type === "faculty" ? "Faculty" : "Unknown"}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Phone Number:</span>
                  <p>{faculty.phone_number || "N/A"}</p>
                </div>
              </div>

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                  <p>{faculty.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Department:</span>
                  <p>{faculty.department_name}</p>
                </div>
              </div>

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Employment Type:</span>
                  <p>{faculty.employment_type === "full_time" ? "Full Time" : faculty.employment_type === "part_time" ? "Part Time" : faculty.employment_type === "part_time_regular" ? "PT-Regular" : faculty.employment_type === "contract" ? "Contract" : faculty.employment_type === "terminated" ? "Terminated" : "Unknown"}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                  <p>{faculty.status === "active" ? "Active" : "In-Active"}</p>
                </div>
              </div>

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Subjects:</span>
                  <p>{faculty.subjects?.join(', ')}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Teaching Units:</span>
                  <p>{faculty.teaching_units?.join(', ')}</p>
                </div>
              </div>

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Rate Type:</span>
                  <p>{faculty.rate_type}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Rate Value:</span>
                  <p>{faculty.rate_value}</p>
                </div>
              </div>

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Date Start:</span>
                  <p>{faculty.start_date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Date End:</span>
                  <p>{faculty.end_date}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm border border-gray-200  dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Monday:</span>
                  <p className="underline">{faculty.monday}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Tuesday:</span>
                  <p className="underline">{faculty.tuesday}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Wednesday:</span>
                  <p className="underline"> {faculty.wednesday}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Thursday:</span>
                  <p className="underline">{faculty.thursday}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Friday:</span>
                  <p className="underline">{faculty.friday}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Saturday:</span>
                  <p className="underline">{faculty.saturday}</p>
                </div>
              </div>

            </div>

            
            <div className="flex justify-end mt-6">
              <button onClick={handleEdit} className="hover:scale-105 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-6 py-3 text-center">
                Edit
              </button>
            </div>
          </div>

        </div>
      </div> 
      <Modal show={open} onClose={() => setOpen(false)} size="4xl">
        <Modal.Header>Edit Faculty Information</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-5 mb-4 mt-2">
              <div>
                <label htmlFor="department_name" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Select Department </label>
                <select id="department_id" name="department_id" value={formData.department_id} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" > <option value="">Select Department</option> {departments.map((dept) => ( <option key={dept.id} value={dept.id}> {dept.department_name}</option> ))} </select>
              </div> 
              <div>
                <label htmlFor="employment_type" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employment Type</label>
                <select id="employment_type" name="employment_type" value={formData.employment_type} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select Employment Type</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="part_time_regular">PT-Regular</option>
                  <option value="contract">Contract</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label htmlFor="faculty_type" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Faculty Type</label>
                <select id="faculty_type" name="faculty_type" value={formData.faculty_type} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select Faculty Type</option>
                  <option value="department_head">Department Head</option>
                  <option value="faculty">Faculty</option> 
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Middle Name</label>
                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subjects</label>
                <input type="text" name="subjects" value={formData.subjects} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teaching Units</label>
                <input type="text" name="teaching_units" value={formData.teaching_units} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>
               
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-5 shadow-sm   rounded-md dark:shadow-md mt-4">
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <div>
                  <label className="block  text-gray-700 dark:text-gray-300 ">Rate Type</label> 
                  <select name="rate_type" value={formData.rate_type} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" required >
                    <option value="" disabled>Select Rate Type</option>  
                    <option value="baccalaureate">Baccalaureate</option>
                    <option value="master">Master</option>
                    <option value="Doctor">doctor</option> 
                  </select>
                </div>
 
                </div>
                  <div className="flex flex-col space-y-2">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 ">Rate Value</label> 
                      <input type="text" name="rate_value" value={formData.rate_value} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" required />
                    </div>
                  </div> 
                </div> 

            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-6 gap-5 shadow-sm   rounded-md dark:shadow-md mt-4">
              <div className="flex flex-col space-y-2">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 ">Monday</label> 
                  <input type="text" name="monday" value={formData.monday} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 ">Tuesday</label> 
                  <input type="text" name="tuesday" value={formData.tuesday} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 ">Wednesday</label> 
                  <input type="text" name="wednesday" value={formData.wednesday} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 ">Thursday</label> 
                  <input type="text" name="thursday" value={formData.thursday} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 ">Friday</label> 
                  <input type="text" name="friday" value={formData.friday} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 ">Saturday</label> 
                  <input type="text" name="saturday" value={formData.saturday} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className={`text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}> {loading ? 'Updating...' : 'Update Faculty'} </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>  
          <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={anchorOrigin}   
      TransitionComponent={TransitionLeft}   
    >
      <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
        {snackbarMessage}
      </Alert>
    </Snackbar></>
  );
}; 
export default View_Fac;
