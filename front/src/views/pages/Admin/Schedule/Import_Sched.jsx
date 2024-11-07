 
import { useState, forwardRef } from "react";
import { Modal } from "flowbite-react";
import axiosClient from "../../../../api/axiosClient";
import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Import_Sched = ({ fetchFaculty }) => {
  const [open, setOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const vertical = "top";
  const horizontal = "right";

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

  const handleSubmitImport = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosClient.post("/schedule/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.message) {
         
        setSnackbarMessage("Successfully Imported Faculty Schedule");
        setSnackbarSeverity("success");
      } else {
        setMessage(response.data.message);
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
      }

      
      if (fetchFaculty) {
        fetchFaculty();
      }

      setOpen(true);
      setFile(null);  
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      setSnackbarMessage("There was an error uploading the file!");
      setSnackbarSeverity("error");
      setOpen(true);
    }
   
  };
  const handleExport = async () => {
    await axiosClient
      .get("/export/faculty/data", { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "faculty_data.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("There was an error exporting the file!", err);
      });
  };
  return (
    <>
      <div className=" h-10 mb-4 flex items-center justify-between">
        <h1 className="font-semibold text-xl dark:text-white"></h1>
        <div className="flex gap-4 items-center">
          {/* <button
            onClick={handleExport}
            type="button"
            className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none dark:focus:ring-yellow-800"
          >
            Export
          </button> */}
          <button
            onClick={() => setOpenImport(true)}
            type="button"
            className="mt-8 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          >
            Import
          </button>
        </div>
      </div>
      <Modal
        show={openImport}
        size="md"
        onClose={() => setOpenImport(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmitImport}>
            <div className="space-y-6">
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                Import Faculty Sched
              </h1>
              <div className="flex flex-col gap-6">
                <input
                  onChange={handleFileChange}
                  type="file"
                  className="w-full dark:text-white"
                />
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setOpenImport(false)}
                    type="button"
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </form>
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
    </>
  );
};

export default Import_Sched;

