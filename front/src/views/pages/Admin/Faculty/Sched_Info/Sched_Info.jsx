import React, { useEffect, useState, forwardRef } from "react";
import axiosClient from '../../../../../api/axiosClient';
import Logo from "../../../../../assets/images/employee.png";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "flowbite-react";
import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import Make_Sched from "./Make_Sched"; 
import LoadingScreen from "../../../../components/LoadingScreen";
const anchorOrigin = { vertical: 'top', horizontal: 'right' };
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const getDayName = (date) => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = new Date(date).getDay();
  return dayNames[day];
};

const Sched_Info = () => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const { id } = useParams();
  const [faculty, setFaculty] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [facultyId, setFacultyId] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [addSched, setAddSched] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formData, setFormData] = useState({
    date_from: "",
    date_to: "",
    time_start: "",  
    time_end: "",  
    loading: "", 
  });
  const [addSchedData, setAddSchedData] = useState({
    date_from: "",
    date_to: "",
    time_start: "",  
    time_end: "",  
    loading: "", 
  });
  const vertical = "top";
  const horizontal = "right";
  const navigate = useNavigate();

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/schedule/${id}`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule details:', error);
      setError('Error fetching schedule details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [id]);

  useEffect(() => {
    axiosClient.get(`/schedule_edit/${id}`)
      .then(response => {
        setFaculty(response.data.faculty); 
      })
      .catch(error => {
        console.error("There was an error fetching the faculty data!", error);
        setError("Faculty not found");
      });
  }, [id]);

  const handleEdit = (sched) => {
    setSelectedSchedule(sched);
    setFormData({
      date_from: sched.date_from,
      date_to: sched.date_to,
      time_start: sched.time_start,
      time_end: sched.time_end,
      loading: sched.loading,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const convertTo24Hour = (time) => {
      const [timePart, modifier] = time.split(' ');  
      let [hours, minutes] = timePart.split(':'); 
      if (hours === '12') {
        hours = '00';
      } 
      if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
      } 
      return `${hours}:${minutes}`;
    };

    try { 
      const updatedFormData = {
        ...formData,
        time_start: convertTo24Hour(formData.time_start),
        time_end: convertTo24Hour(formData.time_end),
      };

      const data = new FormData();
      Object.keys(updatedFormData).forEach((key) =>
        data.append(key, updatedFormData[key])
      );

      await axiosClient.post(`/schedule_update/${selectedSchedule.id}`, data);

      setLoading(false);
      setSnackbarMessage("Schedule updated successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleClose();
      fetchSchedule();
      navigate(`/sched_info/${id}`);  
    } catch (error) {
      setLoading(false);
      setSnackbarMessage(error.response?.data?.message || "Failed to update schedule.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      await axiosClient.delete(`/schedule/${scheduleId}`);
      setSnackbarMessage("Schedule deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchSchedule();   
    } catch (error) {
      setSnackbarMessage("Failed to delete schedule.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddSchedData({ ...addSchedData, [name]: value });
  };
  const AddSched = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosClient.post('/create_schedule', {
        ...addSchedData,
        faculty_id: faculty.id
      });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setAddSchedData({
        date_from: '',
        date_to: '',
        time_start: '',
        time_end: '',
        loading: ''
      });
      fetchSchedule();  
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'An error occurred');
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
            <div className="mt-4 flex flex-col items-center border border-gray-200 p-4 mb-4 rounded-md dark:bg-gray-800 dark:border-gray-700 shadow-sm dark:shadow-xl">
              <img className="w-36 h-36 mb-4" src={Logo} alt="FACULTY PROFILE" />
              <div className="text-center">
                {/* <h1 className="font-bold text-lg dark:text-gray-300">{faculty.first_name} {faculty.middle_name} {faculty.last_name}</h1> */}
                <h2 className="text-sm dark:text-gray-200">Ph: +61888888888</h2>
                <h2 className="text-sm underline dark:text-gray-200">emp@test.com</h2>
              </div>
            </div>
            <div className="w-full">
              <ul className="flex flex-col items-start">
                <Link to={`/view_faculty/${id}`} className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-4 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase">Personal Info</Link>
                <a href="#" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-500 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase">Schedule Info</a>
                <a href="#" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase">Attendance Info</a>
                <a href="#" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase">Bank Account Details</a>
                <a href="#" className="text-center border border-gray-200 py-2 pl-4 w-full text-left bg-gray-800 font-semibold mt-1 dark:bg-gray-800 dark:border-gray-700 text-gray-200 dark:text-gray-200 shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 rounded-xl uppercase">Documents</a>
              </ul>
            </div>
          </div>
         
          <div className="col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
          <div className="flex flex-col items-start mb-5">
            <div className="flex w-full justify-between items-center">
              <h1 className="font-semibold text-xl dark:text-white uppercase">Schedule Information</h1>
              <button
                type="button"
                onClick={handleOpenModal}
                className="py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add New Schedule
              </button>
              <Make_Sched
        open={modalOpen}
        setOpen={setModalOpen}
        fetchSchedule={fetchSchedule}
        facultyId={facultyId}
      />
            </div>
            <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} />
          </div>

            <div className="relative overflow-x-auto">
            <div className="max-h-[26rem] overflow-y-auto">
              <table className="table-auto w-full   divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Date</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Day</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Time</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Loading</th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {schedule.length > 0 ? (
                    schedule.map((sched, index) => (
                      <tr key={index} className="border border-slate-300 bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:border-slate-600">
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{sched.date_from} / {sched.date_to}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{getDayName(sched.date_from)}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{sched.time_start} / {sched.time_end}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{sched.loading === "regular" ? "Regular" : sched.loading === "overload" ? "Overload" : "Unknown"}</td>
                        <td className="flex justify-center p-2 border border-slate-300 dark:border-slate-600">
                          <button onClick={() => handleEdit(sched)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2">
                            <AiOutlineEdit size={24} />
                          </button>
                          <button onClick={() => handleDelete(sched.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2">
                            <AiOutlineDelete size={24} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-2 px-4 text-center">No schedule information available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> 
           </div> 

          </div>
        </div>
      </div>
 
      <Modal show={open} onClose={handleClose}>
        <Modal.Header>Edit Schedule</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2  gap-4 mb-4">
              <div>
                <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date From</label>
                <input type="date" id="date_from" name="date_from" value={formData.date_from} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div>
              <div>
                <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date To</label>
                <input type="date" id="date_to" name="date_to" value={formData.date_to} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div>
              <div>
                <label htmlFor="time_start" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Start</label>
                <input type="time" id="time_start" name="time_start" value={formData.time_start} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div>
              <div>
                <label htmlFor="time_end" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time End</label>
                <input type="time" id="time_end" name="time_end" value={formData.time_end} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div> 
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 mt-5">
                <label htmlFor="loading" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loading</label>
                <select id="loading" name="loading" value={formData.loading} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select Loading</option>
                  <option value="regular">Regular</option>
                  <option value="overload">Overload</option>
                </select>
              </div> 
            <div className="flex justify-end mt-2 ">
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500" > Save Changes </button>
              <button type="button" onClick={handleClose} className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:hover:bg-gray-500" > Cancel </button>
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
    </Snackbar>
    <Modal show={addSched} size="lg" onClose={() => setAddSched(false)} popup>
      <Modal.Header>Add Schedule</Modal.Header>
      <Modal.Body>
          <form onSubmit={AddSched}>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2  gap-4 mb-4">
              <div>
                <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date From</label>
                <input type="date" id="date_from" name="date_from" value={addSchedData.date_from} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div>
              <div>
                <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date To</label>
                <input type="date" id="date_to" name="date_to" value={addSchedData.date_to} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div>
              <div>
                <label htmlFor="time_start" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Start</label>
                <input type="time" id="time_start" name="time_start" value={addSchedData.time_start} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div>
              <div>
                <label htmlFor="time_end" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time End</label>
                <input type="time" id="time_end" name="time_end" value={addSchedData.time_end} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" required />
              </div> 
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 mt-5">
                <label htmlFor="loading" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loading</label>
                <select id="loading" name="loading" value={addSchedData.loading} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select Loading</option>
                  <option value="regular">Regular</option>
                  <option value="overload">Overload</option>
                </select>
              </div> 
            <div className="flex justify-end mt-2 ">
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500" > Save Changes </button>
              <button type="button" onClick={handleClose} className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:hover:bg-gray-500" > Cancel </button>
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
    </Snackbar>
       </>
  );
};    

export default Sched_Info;
