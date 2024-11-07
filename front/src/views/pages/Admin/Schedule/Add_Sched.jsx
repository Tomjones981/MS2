 
import { useState, forwardRef, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axiosClient from "../../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
 

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Add_Sched = ({ fetchFaculty }) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const vertical = "top";
  const horizontal = "right";
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    designation: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const AddFaculty = async (e) => {
    e.preventDefault();
    setLoading(true);

    const facultyFormData = new FormData();
    facultyFormData.append("first_name", formData.first_name);
    facultyFormData.append("middle_name", formData.middle_name);
    facultyFormData.append("last_name", formData.last_name);
    facultyFormData.append("designation", formData.designation);
    facultyFormData.append("status", "active");

    try {
      const facultyResponse = await axiosClient.post(
        "/create_faculty",
        facultyFormData
      );
      setLoading(false);
      setMessage(facultyResponse.data.message || "Successfully Created");
      setSnackbarMessage("Faculty Successfully Created");
      setSnackbarSeverity("success");
      if (fetchFaculty) {
        fetchFaculty();
      }

      setFaculty((prevFaculty) => [
        ...prevFaculty,
        facultyResponse.data.faculty,
      ]);
      setOpen(true);
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        designation: "",
      });

      setOpenModal(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed To Create Faculty. Please Try Again Later!!");
      }
    }
  };

  return (
    <div>
      <div>
        <div className="h-10 mb-4 flex items-center justify-between 0">
          <h1 className="font-semibold text-xl dark:text-white">Schedule</h1>
          <button
            onClick={() => setOpenModal(true)}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          >
            Add
          </button>
        </div>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              Add Schedule
            </h1>
            <form onSubmit={AddFaculty} className="flex flex-col gap-6">
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
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    First Name
                  </label>
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
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Middle Name
                  </label>
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
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Last Name
                  </label>
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
                  onClick={() => setOpenModal(false)}
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        TransitionComponent={TransitionLeft}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Add_Sched;
