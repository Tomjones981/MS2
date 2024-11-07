import { useState, forwardRef, useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import axiosClient from "../../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { HiPlusCircle } from "react-icons/hi";
import Import_Fac from "./Import_Fac";
import Add_Fac from './Add_Fac';
import { Modal } from "flowbite-react";
import { useParams } from 'react-router-dom'; 
import { Pagination } from 'antd';  
import { ClipLoader } from "react-spinners"; 
import { BeatLoader } from 'react-spinners' 
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Display_Fac = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",   
    department_id: "",
    employment_type: "", 
    status: "", 
  });

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

  const fetchFaculty = () => {
    setLoading(true);
    axiosClient.get('/faculty')
      .then(response => {
        setFacultyList(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the faculty data!', error);
      });
  };

  useEffect(() => { 
    fetchFaculty();
  }, []); 
  const handleEdit = (facultyId) => {
    const faculty = facultyList.find(f => f.id === facultyId);
    setSelectedFaculty(faculty);  
    setIsModalOpen(true);  
  };
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedFaculty({
      ...selectedFaculty,
      [name]: value,
    });
  };
 
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosClient.put(`/faculty/${selectedFaculty.id}`, selectedFaculty);
      setMessage(response.data.message);
      setIsModalOpen(false);  
      fetchFaculty();  
    } catch (error) {
      setMessage('An error occurred while updating faculty information');
    }
  };

  const handleView = (id) => {
    navigate(`/view_faculty/${id}`);
  };

  const handleAdd = () => {
    navigate('/create_faculty');
  };

  const handleDelete = (facultyId) => {
    setFacultyList((prevFaculty) => prevFaculty.filter((f) => f.id !== facultyId));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignationFilter(e.target.value);
  };

  const filteredFaculty = facultyList.filter((facultyMember) => {
    console.log('Filtering:', {
      id: facultyMember.id,
      name: facultyMember.full_name,
      employmentType: facultyMember.employment_type,
      searchTerm: searchTerm.toLowerCase(),
      designationFilter: designationFilter
    });
  
    return (
      (facultyMember.id.toString().includes(searchTerm.toLowerCase()) || 
      `${facultyMember.id} ${facultyMember.full_name ? facultyMember.full_name + ' ' : ''}${facultyMember.full_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())) &&
      (designationFilter === "" || facultyMember.employment_type === designationFilter)
    );
  });
  
  
  const paginatedFaculty = filteredFaculty.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const onPaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);   
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mt-2 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-5 font-semibold text-xl dark:text-white">Faculty</h1>
        <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '105%' }}/>
          
        <div>
          <div className="flex items-center justify-between mb-4 ">
            <div>
              <select
                name="designationFilter"
                value={designationFilter}
                onChange={handleDesignationChange}
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="part_time_regular">PT-Regular</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" value={searchTerm} onChange={handleSearchChange} className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by ID or Name" />
            </div>
          </div>

          <div className="relative overflow-x-auto no-scrollbar">
            <div className="max-h-[20rem] overflow-y-auto">
              <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
                <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase"> ID </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase"> Full Name </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase"> Designation </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase"> Department </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase"> Employment Type </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase"> Status </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase"> Actions </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        <div className="flex justify-center items-center">
                          <BeatLoader loading={loading} color="#0000FF" />
                      </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedFaculty.map((faculty) => (
                      <tr key={faculty.id} className="border border-slate-300 bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:border-slate-600 ">
                        <th scope="row" className="border border-slate-300 px-6 py-4 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 dark:border-slate-600 text-center"> {faculty.id} </th>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{faculty.full_name}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">{faculty.designation === "baccalaureate" ? "Baccalaureate" : faculty.designation === "master" ? "Master" : faculty.designation === "doctor" ? "Doctor" : "Unknown"}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">{faculty.department}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">{faculty.employment_type === "full_time" ? "Full Time" : faculty.employment_type === "part_time" ? "Part Time" : faculty.employment_type === "part_time_regular" ? "PT-Regular" : faculty.employment_type === "contract" ? "Contract" : faculty.employment_type === "terminated" ? "Terminated" : "Unknown"}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 text-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded dark:bg-gray-800 dark:text-gray-400 text-center ${ faculty.status === "active" ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300" : faculty.status === "inactive" ? "text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-400" : "text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-400" }`}> {faculty.status === "active" ? "Active" : faculty.status === "inactive" ? "Inactive" : "Unknown"} </span>
                        </td>
                        <td className="flex justify-center p-3 dark:border-slate-600">
                          <button onClick={() => handleView(faculty.id)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                            <AiOutlineEye size={24} />
                          </button>
                          {/* <button onClick={() => handleEdit(faculty.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2">
                            <AiOutlineEdit size={24} />
                          </button>  */}
                        </td>
                      </tr>
                    ))
                  )}
                  {filteredFaculty.length === 0 && !loading && (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No Faculty found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4 space-x-2"> 
              <Pagination
                current={currentPage}
                total={filteredFaculty.length}
                pageSize={pageSize}
                onChange={onPaginationChange}
                className="ml-4"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 right-1 text-5xl text-gray-900 dark:text-white" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <button>
          <HiPlusCircle />
        </button>
        {isHovered && (
          <div className="absolute bottom-12 -ml-[11rem] flex flex-col items-center space-y-2 text-xl text-white bg-gray-900 border border-gray-400 dark:border-gray-200 p-4 shadow-lg rounded-bl-[4rem] rounded-br-sm rounded-tr-[4rem]">
            <Import_Fac fetchFaculty={fetchFaculty} />
            <div className="flex justify-center items-center   "> 
              <button onClick={() => handleAdd()} className="relative text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Add Faculty</button>
            </div>
          </div>
        )}
      </div> 
      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>Edit Faculty</Modal.Header>
        <Modal.Body>
          {selectedFaculty && (
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:gri-cols-3 lg:grid-cols-3 gap-5 mb-4">
                <div>
                  <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">First Name:</label>
                  <input type="text" name="first_name" value={selectedFaculty.first_name || ""} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">Middle Name:</label>
                  <input type="text" name="middle_name" value={selectedFaculty.middle_name || ""} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">Last Name:</label>
                  <input type="text" name="last_name" value={selectedFaculty.last_name || ""} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 uppercase">Rate Type:</label> 
                <select name="rate_type" value={selectedFaculty.rate_type} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" required >
                  <option value="" disabled>Select Rate Type</option>  
                  <option value="baccalaureate">Baccalaureate</option>
                  <option value="master">Master</option>
                  <option value="Doctor">doctor</option> 
                </select>
              </div> 
              <div>
                <label htmlFor="department_name" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select Department
                </label>
                <select
                  id="department"
                  name="department_id"  
                  value={selectedFaculty.department_id || ""}  
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div> 
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">Department:</label>
                <input type="text" name="department" value={selectedFaculty.department || ""} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label htmlFor="employment_type" className="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employment Type</label>
                <select id="employment_type" name="employment_type" value={selectedFaculty.employment_type} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select Employment Type</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div> 
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select id="status" name="status" value={selectedFaculty.status} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>  
              <div className="flex items-center justify-end">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" > Save Changes </button>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Display_Fac;
