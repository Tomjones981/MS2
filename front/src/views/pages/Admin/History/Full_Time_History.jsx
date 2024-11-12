 
import React, { useState } from 'react';
import { DatePicker, Typography, Space, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../../../api/axiosClient';
import { FaUserTie, FaUserClock, FaUserCheck, FaUserPlus, FaUserFriends } from 'react-icons/fa';   
 import printIcon from '../../../../assets/images/print.png';
 import Logo from '../../../../assets/images/OCC_LOGO.png';
 import { BeatLoader } from 'react-spinners'; 

const { RangePicker } = DatePicker;

const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

const Full_Time_History = () => {
    const [adjustmentAmount, setAdjustmentAmount] = useState(null);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [payrollData, setPayrollData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdjustmentChange = (e) => {
      setAdjustmentAmount(e.target.value);
  };

    const handleDateChange = (dates) => {
        setDateRange(dates);
      };

     
      const fetchPayrollHistory = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);  
     
        const dateFrom = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
        const dateTo = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
    
        console.log("Fetching payroll history from:", dateFrom, "to:", dateTo);
    
        if (!dateFrom || !dateTo) {
          setError('Please select a valid date range.');
          setLoading(false);
          return;
        }
    
        try {
          const response = await axiosClient.get('/get-payroll-history/full/time', {
            params: {
              date_from: dateFrom,
              date_to: dateTo,
            },
          });
          console.log("Payroll data received:", response.data);  
          setPayrollData(response.data);
        } catch (err) {
          setError('Error fetching payroll data. Please try again.');
          console.error("Error fetching payroll data:", err);  
        }finally {
          setLoading(false);   
        }
      };
 
    

    const printTable = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
    
        const dateFrom = dateRange[0] ? dateRange[0].startOf('month').format('YYYY-MM-DD') : '';   
        const dateTo = dateRange[1] ? dateRange[1].endOf('month').format('YYYY-MM-DD') : '';     
    
        const formattedDateRange = dateFrom && dateTo ? formatMonthRange(dateFrom, dateTo) : 'Date range not selected';
    
        printWindow.document.write('<html><head><title>Print Table</title>');
        printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 8px; } th { background-color: #f2f2f2; } .mb-10 { margin-bottom: 10px; } .flex { display: flex; } .items-center { align-items: center; } .justify-center { justify-content: center; } .border { border: 1px solid #ccc; } .bg-white { background-color: white; } .rounded-md { border-radius: 0.375rem; } .shadow-md { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); } .text-center { text-align: center; } .text-sm { font-size: 0.875rem; } .text-lg { font-size: 1.125rem; } .font-bold { font-weight: bold; } .logo { width: 6rem; height: 6rem; object-fit: contain; margin: 4px;} .p-2 {padding: -10px;} .text-left { text-align: left; } .text-right { text-align: right; } .footer { margin-top: 20px; text-align: left; font-size: 14px; } .signature { margin-top: 20px; display: flex; justify-content: space-between; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>Full Time Faculties Payroll</h2>'); 
        printWindow.document.write(`
            <div class="flex items-center justify-center border bg-white p-2 mb-10 rounded-md shadow-md -m-5">
                <img src="${Logo}" alt="occ_logo" class="logo" />
                <div class="text-center">
                    <h1 style="font-size: 16px; font-weight: 600;  uppercase;">OPOL COMMUNITY COLLEGE</h1>
                    <p style="font-size: 16px; font-weight: 600;  uppercase;">Opol, Misamis Oriental</p>  
                    <p style="font-size: 16px; font-weight: 600;  uppercase;"><strong ></strong> ${formattedDateRange}</p>
                </div>
            </div>
        `);
        printWindow.document.write('<table>');
        printWindow.document.write('<thead><tr><th class="text-center">Faculty Name</th><th class="text-center">Monthly</th><th class="text-center">Worked Days</th><th class="text-center">Gross</th><th class="text-center">Late</th><th class="text-center">W/holding Tax</th><th class="text-center">Adjustment</th><th class="text-center">Net Pay</th><th class="text-center">Signature</th></tr></thead>');
        printWindow.document.write('<tbody>');
    
        let totalMonthly = 0;
        let totalGross = 0;
        let totalLateAmount = 0;
        let totalTax = 0;
        let totalAdjustment = 0;
        let totalNetPay = 0;
    
        payrollData.forEach(payroll => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td class="text-left">${payroll.full_name}</td>`);
            printWindow.document.write(`<td class="text-right">₱${formatNumber(payroll.monthly_rate)}</td>`);
            totalMonthly += parseFloat(payroll.monthly_rate || 0);
            printWindow.document.write(`<td class="text-center">${payroll.hours_or_days}</td>`);
            printWindow.document.write(`<td class="text-right">₱${formatNumber(payroll.gross_amount)}</td>`);
            totalGross += parseFloat(payroll.gross_amount || 0);
            printWindow.document.write(`<td class="text-center">${formatNumber(payroll.late_amount.toFixed(2))}</td>`);
            totalLateAmount += parseFloat(payroll.late_amount || 0);
            printWindow.document.write(`<td class="text-right">₱${formatNumber(payroll.tax)}</td>`);
            totalTax += parseFloat(payroll.tax || 0);
            printWindow.document.write(`<td class="text-right">₱${formatNumber(payroll.adjustment)}</td>`);
            totalAdjustment += parseFloat(payroll.adjustment || 0);
    
            const adjustedNetPay = (payroll.adjusted_netpay === 0 || payroll.adjusted_netpay === null || payroll.adjusted_netpay === undefined) 
                ? payroll.netpay 
                : payroll.adjusted_netpay;
            totalNetPay += parseFloat(adjustedNetPay || 0);
    
            printWindow.document.write(`<td class="text-right">₱${formatNumber(adjustedNetPay)}</td>`);
            printWindow.document.write(`<td class="text-center"></td>`);
            printWindow.document.write('</tr>');
        });
    
        printWindow.document.write('</tbody>');
    
        // Add total row
        printWindow.document.write(`
            <tfoot>
                <tr>
                    <td class="text-left font-bold">Total</td>
                    <td class="text-right font-bold">₱${formatNumber(totalMonthly)}</td>
                    <td class="text-center"></td>
                    <td class="text-right font-bold">₱${formatNumber(totalGross)}</td>
                    <td class="text-center font-bold">₱${formatNumber(totalLateAmount.toFixed(2))}</td>
                    <td class="text-right font-bold">₱${formatNumber(totalTax)}</td>
                    <td class="text-right font-bold">₱${formatNumber(totalAdjustment)}</td>
                    <td class="text-right font-bold">₱${formatNumber(totalNetPay)}</td>
                    <td class="text-center"></td>
                </tr>
            </tfoot>
        `);
    
        printWindow.document.write('</table>');
        const formattedTotalNetPay = totalNetPay.toLocaleString();
        printWindow.document.write(`
            <div class="footer">
                <div class="signature">
                    <div>
                        <p>CERTIFIED: I hereby certify that the above payroll is correct and that services stated above have been duly rendered.</p>
                        <p><strong>Dolorita N. Arao</strong><br>College President-OIC</p>
                    </div>
                    <div>
                        <p>APPROVED:</p>
                        <p><strong>Atty. Jayfrancis D. Bago</strong><br>Municipal Mayor</p>
                    </div>
                </div>
                <div class="signature">
                    <div>
                        <p>CERTIFIED: Funds available in the amount of <strong>₱${formattedTotalNetPay}</strong></p>
                        <p><strong>Lalaine M. Cariliman</strong><br>Acting Municipal Treasurer</p>
                    </div>
                </div>
            </div>
        `);
    
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };
    
    
    
    
    
    
     
    function formatMonthRange(dateFrom, dateTo) {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        
        const month = from.toLocaleString('default', { month: 'long' });
        const year = from.getFullYear();
        
        return `${month} 1-${new Date(year, from.getMonth() + 1, 0).getDate()}, ${year}`;   
    }
    
     

      const filteredPayrollData = payrollData.filter(payroll =>
        payroll.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function formatDateRange(dateFrom, dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
    
      const sameMonth = from.getMonth() === to.getMonth();
      const month = from.toLocaleString('default', { month: 'long' });
      const year = from.getFullYear();
    
      if (sameMonth) {
        return `${month} ${from.getDate()}-${to.getDate()}, ${year}`;
      } else { 
        const monthTo = to.toLocaleString('default', { month: 'long' });
        return `${month} ${from.getDate()} - ${monthTo} ${to.getDate()}, ${year}`;
      }
    }
    
    
 
    const buttons = [
        { label: 'Full Time', route: '/admin/history/full/time', icon: <FaUserTie />, color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' },
        { label: 'Part Time', route: '/admin/history/part/time', icon: <FaUserClock />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'Extra Load', route: '/extra_load', icon: <FaUserCheck />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'PT-Regular', route: '/admin/history/part/time/regular', icon: <FaUserPlus />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
        { label: 'Program Heads', route: '/admin/history/program/heads', icon: <FaUserFriends />, color: 'bg-gray-600 hover:bg-gray-500 text-gray-200' },
    ];

  return (
    <div className="mt-2 col-span-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="bg-gray-800 p-6 m-1 rounded-lg shadow-md"> 
        
        <div className="flex flex-col items-start mb-5">
          <div className="flex w-full justify-between items-center">
            <h1 className="font-bold text-2xl text-white uppercase tracking-wide">PARYOLL HISTORY</h1> 
            <button type="button" className="flex items-center justify-between py-2 px-4 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" onClick={printTable} >Print <img src={printIcon} alt="Print" className="  w-5 h-5" /> </button>
          </div>
          <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} />
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {buttons.map(({ label, route, color, icon }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              type="button"
              className={`flex items-center justify-center py-2 px-4   rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 ${color}`}
            >
                <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-10'>
        <form onSubmit={fetchPayrollHistory}> 
          <div className="grid grid-cols-10 mt-2 mb-2 gap-4"> 
            <div className="col-span-7">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Date Range</label>
              <Space direction="vertical" size={12} className="text-gray-700 dark:text-gray-200">
                <RangePicker 
                  onChange={handleDateChange} 
                  className="h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" 
                />
              </Space>
              
              <button type="submit" disabled={loading} className={`hover:scale-110 flex justify-center items-center gap-2 text-white bg-gradient-to-br from-gray-600 to-blue-900 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-11 py-3 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 -mt-[2.7rem] ml-[20rem] ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                  
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
                  </svg>
                ) : (
                  <> 
                    Generate
                  </>
                )}
              </button>
            </div> 
            <div className="relative col-span-3 flex items-end">
              <input 
                type="search" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Search name" 
              />
            </div>
          </div>

        </form>
        
        <div className="relative overflow-x-auto">
          <div className="max-h-[22rem] overflow-y-auto mb-4">
            {error && <p className="text-red-500">{error}</p>}
            
            <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200">
              <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Date Range</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Faculty Name</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Monthly</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Worked Days</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Gross</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Late</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Withholding Tax</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Adjustment</th>
                  <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-center">Net Pay</th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center text-gray-500 dark:text-gray-400 py-4">
                        <p className='flex justify-center text-blue-500'><BeatLoader size={12} /></p>
                    </td>
                  </tr>
                ) : filteredPayrollData && filteredPayrollData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredPayrollData?.map((payroll, index) => {
                    const adjustedNetPay = (payroll.adjusted_netpay === 0 || payroll.adjusted_netpay == null)
                      ? payroll.netpay
                      : payroll.adjusted_netpay; 

                    return (
                      <tr key={`${payroll.faculty_id}-${index}`} className="bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-slate-200">
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{formatDateRange(payroll.date_from, payroll.date_to)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{payroll.full_name}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">₱{formatNumber(payroll.monthly_rate)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{payroll.hours_or_days}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">₱{formatNumber(payroll.gross_amount)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">{formatNumber(payroll.late_amount.toFixed(2))}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">₱{payroll.tax}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">₱{formatNumber(payroll.adjustment ?? 0)}</td>
                        <td className="px-6 py-3 border border-slate-300 dark:border-slate-600 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400 text-center">₱{formatNumber(adjustedNetPay)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div> 
    </div>
  );
};

export default Full_Time_History;
