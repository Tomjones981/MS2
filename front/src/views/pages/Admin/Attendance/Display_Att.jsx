import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../../api/axiosClient';
import BeatLoader from 'react-spinners/BeatLoader';
import Import_Att from './Import_Att';
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const Display_Att = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]); 
  const [attendanceData, setAttendanceData] = useState([]);  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
 
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
 
  const fetchAttendance = () => {
    if (selectedFaculty.length > 0 && fromDate && toDate) {
      setLoading(true); 
      axiosClient.get(`/attendance`, {
        params: {
          facultyIds: selectedFaculty,
          from: fromDate,
          to: toDate
        }
      })
      .then(response => {
        setAttendanceData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching attendance data:', error);
        setLoading(false); 
      });
    } else {
      alert("Please select faculty and date range.");
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);
 
  const handleFacultySelection = (facultyId) => {
    if (selectedFaculty.includes(facultyId)) { 
      setSelectedFaculty(selectedFaculty.filter(id => id !== facultyId));
    } else { 
      setSelectedFaculty([...selectedFaculty, facultyId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFaculty.length === facultyList.length) {
      setSelectedFaculty([]); 
    } else {
      setSelectedFaculty(facultyList.map(faculty => faculty.id)); 
    }
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFacultyList = facultyList.filter(faculty => {
    return faculty.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || faculty.id.toString().includes(searchTerm);
  });

  const handleDateChange = (dates, dateStrings) => {
    setFromDate(dateStrings[0]);
    setToDate(dateStrings[1]);
  };

  const formatTime12Hour = (timeStr) => {
    if (timeStr === "00:00:00" || timeStr === "00:00") {
      return "--";   
    }
  
    const [hours, minutes, seconds] = timeStr.split(':');
    let hour = parseInt(hours);
  
    const isPM = hour >= 12;
    if (hour === 0) {
      hour = 12;   
    } else if (hour > 12) {
      hour -= 12;   
    }
  
    const ampm = isPM ? 'PM' : 'AM';
    const formattedMinutes = minutes.padStart(2, '0');
  
    return `${hour}:${formattedMinutes} ${ampm}`;
  };
 
  // const formatTime12Hour = (timeStr) => {
  //   if (timeStr === "00:00:00" || timeStr === "00:00") {
  //     return "--";  
  //   }
  //   const [hours, minutes] = timeStr.split(':');
  //   const date = new Date();
  //   date.setHours(parseInt(hours), parseInt(minutes));
    
  //   return date.toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: 'numeric',
  //     hour12: true
  //   });
  // };

  return (
    <>
      <div className='p-2'>
        <div className='grid grid-cols-11 gap-4'> 
          <div className='col-span-3 flex flex-col   p-4 border border-gray-200 bg-white rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700'>
            <h1 className="mb-5 font-semibold text-lg dark:text-white">FACULTIES</h1>
            <div className="relative -mt-4 mb-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search"   value={searchTerm} onChange={handleSearchChange} className="block w-full p-1.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by ID or Name" />
            </div>
            <label className="flex items-center space-x-2 mb-2 dark:text-white">
              <input type="checkbox" checked={facultyList.length > 0 && selectedFaculty.length === facultyList.length} onChange={handleSelectAll} className="text-sm border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500" />
              <span>Select All</span>
            </label>
            <ul className="space-y-2 overflow-y-auto" style={{ maxHeight: '26rem' }}>
            {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      <div className="flex justify-center items-center justify-center">
                        <BeatLoader loading={loading} color="#0000FF " className='ml-16'/>
                    </div>
                    </td>
                  </tr>
                ) : (
                  filteredFacultyList.map(faculty => ( 
                <li key={faculty.id}>
                  <label className="flex items-center space-x-2 dark:text-gray-300">
                    <input type="checkbox" value={faculty.id} checked={selectedFaculty.includes(faculty.id)} onChange={() => handleFacultySelection(faculty.id)} className="text-sm border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500" />
                    <span>({faculty.id}) {faculty.full_name}</span>
                  </label>
                </li>
              ))
            )}
            </ul>
          </div>
 
          <div className='col-span-8 flex flex-col  p-4 border border-gray-200 bg-white rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700'>
            <form  >
              <div className="grid grid-cols-12 mt-2 mb-3 gap-4  ">
                <div className="col-span-10">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
                  <Space direction="vertical" size={12} className='text-gray-700 dark:text-gray-200'>
                    <RangePicker onChange={handleDateChange} className='h-10 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'/> 
                  </Space>
                  <button type="submit" onClick={handleSubmit} className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-blue-600 dark:hover:bg-blue-700"> Generate </button>
                </div>   
                <div className="col-span-2 flex items-end">
                  <Import_Att  /> 
                </div>
              </div>
            </form>
             {/* <div className="-mt-16 ml-80 col-span-2 flex items-end"> 
                <div className='ml-60 -mt-1'>
                  <Import_Att  /> 
                </div>
              </div> */}
            <div> 
              <div className="mt-2 relative overflow-x-auto bg-white dark:bg-gray-900">
                <div className="max-h-[25rem] overflow-y-auto">
                  <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200 dark:border-slate-700">
                    <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-700 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200 dark:border-slate-700">
                      <tr className="">
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Faculty Name</th>
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Date</th>
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Time In</th>
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Time Out</th>
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Hours Worked</th>
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Late</th>
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Undertime</th>
                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (  
                        <tr>
                          <td colSpan="6" className="text-center p-4">
                            <div className="flex justify-center items-center">
                              <BeatLoader loading={loading} color="#0000FF" />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        attendanceData.map(faculty => (
                          faculty.attendance.map(att => (
                            <tr key={`${faculty.faculty_id}-${att.date}`} className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900"> 
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{faculty.full_name}</td>
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{formatDate(att.date)}</td>
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{formatTime12Hour(att.time_in)}</td>
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{formatTime12Hour(att.time_out)}</td>
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{att.hours_worked}</td> 
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400">{att.late}</td> 
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400">{att.undertime}</td> 
                              <td className="border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400">
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${att.status === "Present" ? "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300" : att.status === "Absent" ? "text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-400" : att.status === "RESTDAY" ? "text-yellow-800 bg-yellow-100 dark:bg-yellow-500 dark:text-gray  -200" : "text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-400"}`}>
                                  {att.status === "Present" ? "Present" : att.status === "Absent" ? "Absent" : att.status === "RESTDAY" ? "RESTDAY" : "Unknown"}
                                </span>
                              </td>
                            </tr>
                          ))
                        ))
                      )}
                    </tbody>
                  </table>  
                  {attendanceData.length === 0 && !loading && (
                        <p className="mt-4 text-center text-gray-500 dark:text-gray-300">No Faculty Attendance found.</p>
                      )}
                </div>   
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Display_Att;
