 
import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../../api/axiosClient'; 
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import printIcon from '../../../../../assets/images/print.png'
import excelIcon from '../../../../../assets/images/excel.png'
import Logo from '../../../../../assets/images/OCC_LOGO.png'

const Full_Time_Attendance = () => {
    const { facultyId } = useParams();
    const location = useLocation();
    const { selectedDates, MonthlyRate, workDays, TotalPresent, grossSalary, adjustmentAmount, TotalLateTime, withholdingTax, netPay} = location.state || { selectedDates: [] };
    const [loading, setLoading] = useState(false);
    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [facultyName, setFacultyName] = useState('');

    const fetchAttendanceDetails = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/faculty-attendance/${facultyId}`);
            setAttendanceDetails(response.data);
            if (response.data.length > 0) {
                setFacultyName(response.data[0].full_name);  
            }
        } catch (error) {
            console.error('Error fetching attendance details', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceDetails();
    }, [facultyId]);

    const filteredAttendanceDetails = attendanceDetails.filter(att => {
      const attDate = new Date(att.date);
      if (selectedDates.length < 2) {
        return false;  
    }
      const startDate = new Date(selectedDates[0]);
      const endDate = new Date(selectedDates[1]);
      return attDate >= startDate && attDate <= endDate; 
  });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
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
      

    if (loading) {
        return <div>Loading...</div>;
    }

    const printTable = () => {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Print Table</title>');
      printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } .mb-10 { margin-bottom: 10px; } .flex { display: flex; } .items-center { align-items: center; } .justify-center { justify-content: center; } .border { border: 1px solid #ccc; } .bg-white { background-color: white; } .rounded-md { border-radius: 0.375rem; } .shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); } .text-center { text-align: center; } .text-sm { font-size: 0.875rem; } .text-lg { font-size: 1.125rem; } .font-bold { font-weight: bold; } .logo { width: 6rem; height: 6rem; object-fit: contain; margin: 4px;} .p-2 {padding: -10px;}</style>');
      printWindow.document.write('</head><body>');
      
       
      if (selectedDates.length === 2) {
        printWindow.document.write(`
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 class="">Faculty Name:    ${facultyName}</h3>
                <p><strong>Date Range:</strong> ${formatDate(selectedDates[0])} to ${formatDate(selectedDates[1])}</p>
            </div>
        `);
    }

    printWindow.document.write(`
      <div class="flex items-center justify-center border bg-white p-2 mb-10 rounded-md shadow-md -m-5">
          <img src="${Logo}" alt="occ_logo" class="logo" />
          <div class="text-center">
              <h1 style="font-size: 16px; font-weight: 600;  uppercase;">OPOL COMMUNITY COLLEGE</h1>
              <p style="font-size: 16px; font-weight: 600;  uppercase;">Opol, Misamis Oriental</p>  
              <p style="font-size: 16px; font-weight: 600;  uppercase;"><strong ></strong> ${formatDate(selectedDates[0])} to ${formatDate(selectedDates[1])}</p>
          </div>
      </div>
  `);
    
      printWindow.document.write('<table class="mb-10">');
      printWindow.document.write('<thead><tr><th>MONTHLY</th><th>WORK DAYS</th><th>NO. OF WORKING DAYS</th><th>GROSS AMOUNT</th><th>ADJUSTMENT</th><th>TOTAL LATE</th><th>TAX</th><th>NETPAY</th></tr></thead><tbody>');
      
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>₱${MonthlyRate ? parseFloat(MonthlyRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}</td>`); 
      printWindow.document.write(`<td>${workDays ? parseFloat(workDays).toFixed(2) : "N/A"}</td>`); 
      printWindow.document.write(`<td>${TotalPresent ? parseFloat(TotalPresent).toFixed(2) : "N/A"}</td>`); 
      printWindow.document.write(`<td>₱${grossSalary ? parseFloat(grossSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}</td>`); 
      printWindow.document.write(`<td>₱${adjustmentAmount ? adjustmentAmount : "0"}</td>`); 
      printWindow.document.write(`<td>${TotalLateTime ? TotalLateTime : "0"}</td>`); 
      printWindow.document.write(`<td>₱${withholdingTax ? parseFloat(withholdingTax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}</td>`); 
      printWindow.document.write(`<td>₱${netPay ? parseFloat(netPay).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}</td>`);  
      printWindow.document.write('</tr>'); 
      printWindow.document.write('</tbody></table>');  


      printWindow.document.write('<table class="mb-10">');
      printWindow.document.write('<thead><tr><th>DATE</th><th>TIME IN</th><th>TIME OUT</th><th>HOURS WORKED</th><th>LATE</th><th>UNDERTIME</th><th>REMARKS</th></tr></thead><tbody>');
    
      if (filteredAttendanceDetails.length === 0) {
          printWindow.document.write('<tr><td colspan="7">No data available</td></tr>');
      } else {
          filteredAttendanceDetails.forEach((att) => { 
              printWindow.document.write('<tr>');
              printWindow.document.write(`<td>${formatDate(att.date)}</td>`);
              printWindow.document.write(`<td>${formatTime12Hour(att.time_in)}</td>`);
              printWindow.document.write(`<td>${formatTime12Hour(att.time_out)}</td>`);
              printWindow.document.write(`<td>${att.hours_worked}</td>`);
              printWindow.document.write(`<td>${att.late}</td>`);
              printWindow.document.write(`<td>${att.undertime}</td>`);
              printWindow.document.write(`<td class="px-2 py-1 text-xs font-semibold rounded ${att.status === "Present" ? "text-green-800 bg-green-100" : att.status === "Absent" ? "text-red-800 bg-red-100" : att.status === "RESTDAY" ? "text-yellow-800 bg-yellow-100" : "text-gray-800 bg-gray-100"}">${att.status}</td>`);
              printWindow.document.write('</tr>');
          });
      }
  
      printWindow.document.write('</tbody></table>');  
      printWindow.document.write('</tbody></table></body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
  };


  return (
    <>
      <div>
        <div className="flex items-center justify-center border border-gray-200 bg-white p-2 mb-4 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
          <img src={Logo} alt="occ_logo" className="w-[6rem] h-[6rem]  " />
          <div className="text-center ">
            <h1 className="text-lg font-bold">OPOL COMMUNITY COLLEGE</h1>
            <p className="text-md font-semibold uppercase">Opol, Misamis Oriental</p>  
            <p className="text-md font-semibold uppercase">Municipal Payroll</p> 
          </div>
        </div>
        
        {/* <div className="col-span-5 border border-gray-200 bg-white p-2 mb-4 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
          <h1 className="font-semibold text-xl dark:text-white uppercase items-center text-center">Payroll Details</h1>
        </div> */}
        <div className="col-span-5 border border-gray-200 bg-white p-6 mb-4 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
          <div className="flex flex-col items-start mb-5">
            <div className="flex w-full justify-center items-center">
              <h1 className="font-semibold text-xl dark:text-white uppercase">Payroll Details</h1>
              {/* <div className="flex space-x-2">  
                <button type="button" className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" onClick={printTable} >Print <img src={printIcon} alt="Print" className="  w-5 h-5" /> </button>
              </div> */}
            </div>
            <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} /> 
          </div> 
          <div className="flex flex-col items-start mb-5">
            <div className="flex w-full justify-between items-center">
              <h1 className="font-semibold text-xl dark:text-white uppercase underline">FACULTY NAME: {facultyName}</h1>
              <div className="flex space-x-2">  
                <button type="button" className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" onClick={printTable} >Print <img src={printIcon} alt="Print" className="  w-5 h-5" /> </button>
              </div>
            </div>
            <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} /> 
          </div> 

          <table className='table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse border border-slate-200'>
            <thead className='sticky -top-1 text-xs text-gray-100 bg-gray-700 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200 dark:border-slate-700'>
              <tr>
                {/* <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Faculty Name</th> */}
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Monthly</th>
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Work Days</th>
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">No. Of Working Days</th>
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Gross</th>
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Adjustments (Additional-hr) & (Deduction-U/T)</th>
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">TOTAL LATE</th>
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Tax</th>
                <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 uppercase">Netpay</th> 
              </tr>                 
            </thead>            
            <tbody className=' '>
              <tr>
                {/* <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap'>{facultyName}</td> */} 
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>₱{MonthlyRate ? parseFloat(MonthlyRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}</td>
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>{workDays ? parseFloat(workDays).toFixed(2) : "N/A"}</td>
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>{TotalPresent ? parseFloat(TotalPresent).toFixed(2) : "N/A"}</td>
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>₱{grossSalary ? parseFloat(grossSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}</td>
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>₱{adjustmentAmount ? adjustmentAmount : "0"}</td>
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>{TotalLateTime ? TotalLateTime : "0"}</td>
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>₱{withholdingTax ? parseFloat(withholdingTax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0"}</td>
                <td className='border border-slate-300 px-6 py-4 dark:border-slate-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-center'>₱{netPay ? parseFloat(netPay).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}</td> 
              </tr>
            </tbody>
          </table>          
        </div> 
      </div>       
      <div>
        <div className="col-span-5 border border-gray-200 bg-white p-6 rounded-md shadow-md dark:border-slate-700 dark:bg-gray-800 dark:text-gray-200">
          <div className="flex flex-col items-start mb-5">
            <div className="flex w-full justify-center items-center">
              <h1 className="font-semibold text-xl dark:text-white uppercase">Attendance Details</h1>
              {/* <div className="flex space-x-2">  
                <button type="button" className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" onClick={printTable} >Print <img src={printIcon} alt="Print" className="  w-5 h-5" /> </button>
              </div> */}
            </div>
            <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} /> 
          </div> 
          <div> 
          <p><strong>Date Range:</strong> {selectedDates[0]} to {selectedDates[1]}</p> 
          </div>

            <div className='relative overflow-x-auto no-scrollbar'>
              <div className='max-h-[24rem] overflow-y-auto'>
                <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
                  <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-700 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200 dark:border-slate-700">
                      <tr className=""> 
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
                  {filteredAttendanceDetails.length === 0 ? (
                          <tr>
                              <td colSpan="7" className="text-center">No attendance records found for the selected dates.</td>
                          </tr>
                      ) : (
                      filteredAttendanceDetails.map((att) => (
                          <tr key={att.id}>
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
                    )}
                  </tbody>
                </table>
              </div>
            </div> 
        </div>
      </div>
         
    </>
  )
}

export default Full_Time_Attendance