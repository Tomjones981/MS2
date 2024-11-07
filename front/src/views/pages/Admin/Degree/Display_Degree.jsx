// import React, { useEffect, useState } from "react";
// import axiosClient from '../../../../api/axiosClient';
// import { useNavigate } from 'react-router-dom';

// const Display_Degree = () => {
//   const [faculties, setFaculties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredFaculties, setFilteredFaculties] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosClient.get('/faculty-with-rate-type');
//         console.log("API Response:", response.data);
//         setFaculties(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to load data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const filtered = removeDuplicates(faculties).filter(faculty =>
//       faculty.faculty_full_name && faculty.faculty_full_name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredFaculties(filtered);
//   }, [searchTerm, faculties]);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const viewDetails = (facultyId, facultyName) => {
//     navigate(`/faculties/${facultyId}`, { state: { facultyName } });
//   };

//   const removeDuplicates = (data) => {
//     const seen = new Set();
//     return data.filter(faculty => {
//       const isDuplicate = seen.has(faculty.faculty_id);
//       seen.add(faculty.faculty_id);
//       return !isDuplicate;
//     });
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <div className="mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//         <h1 className="mb-5 font-semibold text-xl dark:text-white">Manage Degree</h1>
//         <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '105%' }} />
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <select name="designationFilter" className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
//                 <option value="">All</option> 
//               </select>
//             </div>
//             <div className="relative">
//               <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
//                 <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
//                 </svg>
//               </div>
//               <input
//                 type="search"
//                 className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 placeholder="Search by Faculty Name"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </div>
//           </div>
//           <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//             <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-center">ID</th>
//                   <th scope="col" className="px-6 py-3 text-center">RATE TYPE</th>
//                   <th scope="col" className="px-6 py-3 text-center">RATE VALUE</th>
//                   <th scope="col" className="px-6 py-3 text-center">TOTAL FACULTY</th>
//                   <th scope="col" className="px-6 py-3 text-center">ACTIONS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredFaculties.length > 0 ? (
//                   filteredFaculties.map(faculty => (
//                     <tr key={faculty.faculty_id} className="justify-center items-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
//                       <td className="px-2 py-2 font-medium text-center text-gray-900 whitespace-nowrap dark:text-gray-400">{faculty.faculty_id}</td>
//                       <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">
//                         {faculty.rate_type_value === "baccalaureate" ? "Baccalaureate" : faculty.rate_type_value === "master" ? "Master" : faculty.rate_type_value === "doctor" ? "Doctor" : "Unknown"}
//                       </td>
//                       <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">{faculty.rate_value}</td>
//                       <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">{faculty.total_faculty_in_rate_type}</td>
//                       <td className="px-2 py-2 text-center">
//                         <button
//                           onClick={() => viewDetails(faculty.faculty_id, faculty.faculty_full_name)}
//                           className="text-blue-500 hover:underline bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//                         >
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-3 text-center text-gray-500 dark:text-gray-300">No Degree found.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Display_Degree;
import React, { useEffect, useState } from "react";
import axiosClient from '../../../../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const Display_Degree = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaculties, setFilteredFaculties] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/faculty-with-rate-type');
        console.log("API Response:", response.data);
        setFaculties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = removeDuplicates(faculties).filter(faculty =>
      faculty.faculty_full_name && faculty.faculty_full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaculties(filtered);
  }, [searchTerm, faculties]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const viewDetails = (facultyId, facultyName) => {
    navigate(`/faculties/${facultyId}`, { state: { facultyName } });
  };

  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter(faculty => {
      const isDuplicate = seen.has(faculty.faculty_id);
      seen.add(faculty.faculty_id);
      return !isDuplicate;
    });
  };

  // Group faculties by rate_type_value
  const groupedFaculties = faculties.reduce((acc, faculty) => {
    if (!acc[faculty.rate_type_value]) {
      acc[faculty.rate_type_value] = {
        rate_type_value: faculty.rate_type_value,
        rate_value: faculty.rate_value,
        total_faculty_in_rate_type: faculty.total_faculty_in_rate_type
      };
    }
    return acc;
  }, {});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-5 font-semibold text-xl dark:text-white">Manage Degree</h1>
        <hr className="-ml-6 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '105%' }} />
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <select name="designationFilter" className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="">All</option>
                {/* Add options here if needed */}
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
                placeholder="Search by Faculty Name"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">ID</th>
                  <th scope="col" className="px-6 py-3 text-center">RATE TYPE</th>
                  <th scope="col" className="px-6 py-3 text-center">RATE VALUE</th>
                  <th scope="col" className="px-6 py-3 text-center">TOTAL FACULTY</th>
                  <th scope="col" className="px-6 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedFaculties).length > 0 ? (
                  Object.values(groupedFaculties).map(faculty => (
                    <tr key={faculty.rate_type_value} className="justify-center items-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-2 py-2 font-medium text-center text-gray-900 whitespace-nowrap dark:text-gray-400">{faculty.rate_type_value}</td>
                      <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">
                        {faculty.rate_type_value === "baccalaureate" ? "Baccalaureate" : faculty.rate_type_value === "master" ? "Master" : faculty.rate_type_value === "doctor" ? "Doctor" : "Unknown"}
                      </td>
                      <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">{faculty.rate_value}</td>
                      <td className="px-2 py-2 text-gray-500 text-center whitespace-nowrap dark:text-gray-400">{faculty.total_faculty_in_rate_type}</td>
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={() => viewDetails(faculty.rate_type_value, faculty.rate_type_value)}
                          className="text-blue-500 hover:underline bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-3 text-center text-gray-500 dark:text-gray-300">No Degree found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display_Degree;
