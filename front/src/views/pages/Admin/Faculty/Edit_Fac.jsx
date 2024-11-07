import { useState, forwardRef, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axiosClient from "../../../../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Edit_Fac = ({ faculty, handleEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    designation: "",
    status: "",
  });

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/faculty');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData();
    if (file) {
      data.append("file", file);
    }
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    axiosClient
      .put(`/edit_faculty/${faculty.id}`, data)
      .then((response) => {
        setLoading(false);
        setSnackbarMessage("Faculty updated successfully.");
        setSnackbarSeverity("success");
        handleEdit(faculty.id); // Call handleEdit to update the selected faculty state
        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setSnackbarMessage(error.response.data.message || "Failed to update faculty.");
        } else {
          setSnackbarMessage("Failed to update faculty.");
        }
        setSnackbarSeverity("error");
      });
  };

  useEffect(() => {
    if (faculty) {
      setFile(faculty.file || null);
      setFormData({
        first_name: faculty.first_name,
        middle_name: faculty.middle_name,
        last_name: faculty.last_name,
        designation: faculty.designation,
        status: faculty.status,
      });
    }
  }, [faculty]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axiosClient
      .get(`/view_faculty/${id}`)
      .then(({ data }) => {
        if (isMounted) {
          setLoading(false);
          setFormData({
            first_name: data.faculty.first_name,
            middle_name: data.faculty.middle_name,
            last_name: data.faculty.last_name,
            designation: data.faculty.designation,
            status: data.faculty.status,
          });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setLoading(false);
          setSnackbarMessage("Failed to fetch faculty information. Please try again later.");
          setSnackbarSeverity("error");
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClickOpen}
      >
        Edit
      </button>
      <Modal show={open} onClose={handleClose}>
        <Modal.Header>Edit Faculty</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">Edit Faculty</h1>
            <form  className="flex flex-col gap-6">
              <div className="space-y-3">
                <div>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Select designation
                    </option>
                    <option value="part_time">Part Time Instructor</option>
                    <option value="full_time">Full Time Instructor</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Middle Name</label>
                  <input
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit"  onSubmit={handleSubmit}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarMessage.length > 0}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage("")}
      >
        <Alert onClose={() => setSnackbarMessage("")} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Edit_Fac;
