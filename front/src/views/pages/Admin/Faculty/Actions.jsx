import React, { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axiosClient from "../../../../api/axiosClient";
import { Modal } from "flowbite-react";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Actions = ({ facultyMember, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
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

  const handleView = (id) => {
    navigate(`/view_faculty/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit_faculty/${id}`);
  };

  const handleDelete = async (facultyId) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/delete_faculty/${facultyId}`);
      onDelete(facultyId);
      setSnackbarMessage("Faculty member deleted successfully.");
      setSnackbarSeverity("success");
      setOpen(true);
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting faculty:", error);
      setSnackbarMessage("Error deleting faculty member.");
      setSnackbarSeverity("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <button type="button" onClick={() => handleView(facultyMember.id)} className="text-blue-500 hover:underline transition transform hover:scale-150" > <MdVisibility className="mr-1" size={20} /> </button>
        <button type="button" onClick={() => handleEdit(facultyMember.id)} className="text-yellow-500 hover:underline transition transform hover:scale-150" > <MdEdit className="mr-1" size={20} /> </button>
        <button type="button" onClick={() => setOpenModal(true)} className="text-red-500 hover:underline transition transform hover:scale-150" > <MdDelete className="mr-1" size={20} /> </button>
      </div>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-center text-xl font-medium text-gray-900 dark:text-white">
              Are you sure you want to delete this faculty?
            </h1>
            <form className="flex flex-col gap-6">
              <div className="flex gap-4 justify-center">
              <button onClick={() => setOpenModal(false)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" > Cancel </button>
              <button type="button" onClick={() => handleDelete(facultyMember.id)} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800" disabled={loading} > {loading ? "Deleting..." : "Delete"} </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }} TransitionComponent={TransitionLeft} >
      <Alert onClose={handleClose} severity={snackbarSeverity} sx={{ width: "100%" }}> {snackbarMessage} </Alert>
      </Snackbar>
    </div>
  );
};

export default Actions;
