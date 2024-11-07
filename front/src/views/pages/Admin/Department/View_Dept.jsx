import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../../../api/axiosClient';
import { BeatLoader } from 'react-spinners';
import { Pagination } from 'antd';  

const View_Dept = () => {
  const [loading, setLoading] = useState(true);
  const { departmentId } = useParams();
  const location = useLocation();
  const [department, setDepartment] = useState(null);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // Pagination state for current page
  const [pageSize, setPageSize] = useState(5);  // Number of items per page
  const departmentName = location.state?.departmentName || 'Department';  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartmentDetails();
  }, [departmentId]);

  const fetchDepartmentDetails = async () => {
    try {
      const response = await axiosClient.get(`/get_faculty_by_department/${departmentId}`);
      setDepartment(response.data);
      setFilteredFaculty(response.data.faculty);  
      setLoading(false); 
    } catch (error) {
      console.error("There was an error fetching the department details!", error);
      setLoading(false); 
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
  
    if (department && department.faculty && Array.isArray(department.faculty)) {
      const filtered = department.faculty.filter(facultyMember => (
        facultyMember.first_name?.toLowerCase().includes(value) ||
        facultyMember.middle_name?.toLowerCase().includes(value) ||
        facultyMember.last_name?.toLowerCase().includes(value)
      ));
      setFilteredFaculty(filtered);
      setCurrentPage(1);  // Reset to the first page after search
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const departmentHead = department?.faculty?.find(facultyMember => facultyMember.faculty_type === 'department_head');
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentFaculty = filteredFaculty.slice(startIndex, endIndex);

  return (
    <div className="mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h1 className="mb-5 font-semibold text-xl dark:text-white uppercase">{departmentName} Department Faculty</h1>
      <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '105%' }}/>
      <h2 className="text-lg font-semibold dark:text-white">
        Department Head: {departmentHead ? `${departmentHead.first_name} ${departmentHead.last_name}` : 'Not Assigned'}
      </h2>
      <div className="flex items-center justify-between mb-4">
        <div>
          <select name="designationFilter" className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="">All</option>
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
            className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className='max-h-[20rem] overflow-y-auto'>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="sticky -top-1 text-xs text-gray-200 uppercase bg-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">ID</th>
                <th scope="col" className="px-6 py-3 text-center">LAST NAME</th> 
                <th scope="col" className="px-6 py-3 text-center">FIRST NAME</th> 
                <th scope="col" className="px-6 py-3 text-center">MIDDLE NAME</th> 
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <p className="text-gray-500 dark:text-gray-300 items-center"><div className="flex justify-center items-center ml-60">
                <BeatLoader loading={loading} color="#0000FF" />
              </div></p>
              ) : (
                currentFaculty.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center">No Faculty found.</td>
                </tr>
              ) : (
                currentFaculty.map((facultyMember) => (
                  <tr key={facultyMember.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-3 text-center">{facultyMember.id}</td>
                    <td className="px-6 py-3 text-center">  {facultyMember.last_name}</td>
                    <td className="px-6 py-3 text-center">{facultyMember.first_name} </td>
                    <td className="px-6 py-3 text-center"> {facultyMember.middle_name} </td>
                  </tr>
                ))
              ) 
            )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredFaculty.length}
            onChange={handlePageChange}
          />
        </div>

        <button onClick={() => navigate(-1)} className="ml-2 mt-4 text-white bg-gradient-to-br from-gray-600 to-gray-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"> Back </button>
      </div>
    </div>
  );
};

export default View_Dept;
