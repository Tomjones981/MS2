import React, { useEffect, useState } from "react";
import axiosClient from '../../../../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners' 

const Display_Dept = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/get_faculty_department");
      setDepartments(response.data);
      setFilteredDepartments(removeDuplicates(response.data));  
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the department data!", error);
    }
  };

  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter(department => {
      const duplicate = seen.has(department.department_name);
      seen.add(department.department_name);
      return !duplicate;
    });
  };

  const viewDetails = (departmentId, departmentName) => {
    navigate(`/departments/${departmentId}`, { state: { departmentName } });
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = removeDuplicates(departments).filter(department =>
      department.department_name.toLowerCase().includes(value)
    );
    setFilteredDepartments(filtered);
  };

  return (
    <div>
      <div className="mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-5 font-semibold text-xl dark:text-white uppercase">  Department INFO</h1>
        <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '105%'  }}/>
        <div>
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
              <input type="search" className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by Department Name" value={searchTerm} onChange={handleSearch} />
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-200 uppercase bg-gradient-to-br from-gray-600 to-gray-600 hover:bg-gradient-to-bl dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">ID</th>
                  <th scope="col" className="px-6 py-3 text-center">DEPARTMENT NAME</th>
                  <th scope="col" className="px-6 py-3 text-center">HEAD NAME</th>
                  <th scope="col" className="px-6 py-3 text-center">TOTAL FACULTY</th>
                  <th scope="col" className="px-6 py-3 text-center">ACTIONS</th>
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
                 filteredDepartments.map((department) => (
                  <tr key={department.id} className="justify-center items-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-2 py-2 font-medium text-center text-gray-900 whitespace-nowrap dark:text-gray-400">{department.id}</td>
                    <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">{department.department_name}</td>
                    <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">{department.department_head}</td>
                    <td className="text-gray-500 text-center whitespace-nowrap dark:text-gray-400">{department.total_faculty}</td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => viewDetails(department.id, department.department_name)}
                        className="hover:scale-110 text-gray-200 bg-gradient-to-br from-gray-800 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
            {filteredDepartments.length === 0 && (
              <p className="mt-4 text-center text-gray-500 dark:text-gray-300">No departments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display_Dept;
