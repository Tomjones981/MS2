import React, { useState } from 'react';
import axiosClient from '../../../../../api/axiosClient'; // Adjust the path as needed
import { Modal } from 'flowbite-react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';

const anchorOrigin = { vertical: 'top', horizontal: 'right' };
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TransitionLeft = (props) => {
  return <Slide {...props} direction="left" />;
};

const Make_Sched = ({ open, setOpen, fetchSchedule, facultyId }) => {
  const [addSchedData, setAddSchedData] = useState({
    date_from: '',
    date_to: '',
    time_start: '',
    time_end: '',
    loading: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddSchedData({ ...addSchedData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the data
    if (!addSchedData.date_from || !addSchedData.date_to || !addSchedData.time_start || !addSchedData.time_end || !addSchedData.loading) {
      setSnackbarMessage("Please fill out all fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosClient.post('/create_schedule', {
        ...addSchedData,
        faculty_id: facultyId
      });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpen(false); // Close the modal after successful submission
      fetchSchedule(); // Refresh the schedule list
    } catch (error) {
      console.error("Error adding schedule:", error);
      setSnackbarMessage(error.response?.data?.message || "An error occurred while adding the schedule.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={open} size="lg" onClose={() => setOpen(false)} popup>
      <Modal.Header>Add Schedule</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date From</label>
              <input
                type="date"
                id="date_from"
                name="date_from"
                value={addSchedData.date_from}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date To</label>
              <input
                type="date"
                id="date_to"
                name="date_to"
                value={addSchedData.date_to}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label htmlFor="time_start" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Start</label>
              <input
                type="time"
                id="time_start"
                name="time_start"
                value={addSchedData.time_start}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label htmlFor="time_end" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time End</label>
              <input
                type="time"
                id="time_end"
                name="time_end"
                value={addSchedData.time_end}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 mt-5">
            <label htmlFor="loading" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loading</label>
            <select
              id="loading"
              name="loading"
              value={addSchedData.loading}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Select Loading</option>
              <option value="regular">Regular</option>
              <option value="overload">Overload</option>
            </select>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal.Body>
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
    </Modal>
  );
};

export default Make_Sched;
