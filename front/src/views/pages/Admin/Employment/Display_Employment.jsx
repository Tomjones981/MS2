import { useState, forwardRef, useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import axiosClient from "../../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { HiPlusCircle } from "react-icons/hi";
import { BeatLoader } from 'react-spinners' 
import { Pagination } from 'antd';  

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Display_Employment = () => {
  const [loading, setLoading] = useState(true);
  const [facultyEmployment, setFacultyEmployment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [isHovered, setIsHovered] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);  
  const [totalFaculty, setTotalFaculty] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosClient.get('/fetch/employment')
      .then(response => {
        setFacultyEmployment(response.data);
        setTotalFaculty(response.data.length);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the employment data!', error);
      });
  }, []);

  const handleView = (id) => {
    navigate(`/view_faculty/${id}`);
  };
 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignationFilter(e.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const filteredFaculty = facultyEmployment.filter(
    (facultyMember) =>
      `${facultyMember.full_name}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (designationFilter === "" || facultyMember.status === designationFilter)
  );
 
  const paginatedFaculty = filteredFaculty.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className="mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-5 font-semibold text-xl dark:text-white uppercase">Faculty Employment</h1>
        <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '105%' }}/>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <select
                name="designationFilter"
                value={designationFilter}
                onChange={handleDesignationChange}
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">In Active</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search by name"
              />
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <div className="max-h-[20rem] overflow-y-auto">
              <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
                <thead className="sticky -top-1  text-xs text-gray-200 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600"> ID </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600"> Full Name </th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600"> Employment Type </th>
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600"> Status </th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600"> Department </th> 
                    <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600"> Actions </th>
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
                    paginatedFaculty.map(faculty => (
                      <tr key={faculty.id} className="border border-slate-300 bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:border-slate-600">
                        <th scope="row" className="border border-slate-300 px-6 py-4 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 dark:border-slate-600"> {faculty.id} </th>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{faculty.full_name}</td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600">{faculty.employment_type === "full_time" ? "Full Time" : faculty.employment_type === "part_time" ? "Part Time" : faculty.employment_type === "contract" ? "Contract" : faculty.employment_type === "terminated" ? "Terminated" :"Unknown"}</td> 
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600"> <span className={`px-2 py-1 text-xs font-semibold rounded dark:bg-gray-800 dark:text-gray-400 ${ faculty.status === "active" ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300" : faculty.status === "inactive" ? "text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-400" : "text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-400" }`}> {faculty.status === "active" ? "Active" : faculty.status === "inactive" ? "Inactive" : "Unknown"} </span> </td>
                        <td className="border border-slate-300 px-6 py-4 dark:border-slate-600">{faculty.department}</td> 
                        <td className="flex justify-center p-3 dark:border-slate-600">
                          <button onClick={() => handleView(faculty.id)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"><AiOutlineEye size={24} /></button>
                         </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredFaculty.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display_Employment;
