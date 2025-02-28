import React, { useState, useEffect } from 'react';
import axiosClient from '../../../../../api/axiosClient';
import { DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
 
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyTotal_Gross_Netpay = () => {
  const [year, setYear] = useState(new Date().getFullYear()); 
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/get-faculty-monthly-totalgross-netpay`, {
        params: { year }
      });
      setPayrollData(response.data);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [year]);
 
  const handleYearChange = (date, dateString) => {
    setYear(dateString);  
  };
 
  const months = [
    { month_num: 1, month_name: "January" },
    { month_num: 2, month_name: "February" },
    { month_num: 3, month_name: "March" },
    { month_num: 4, month_name: "April" },
    { month_num: 5, month_name: "May" },
    { month_num: 6, month_name: "June" },
    { month_num: 7, month_name: "July" },
    { month_num: 8, month_name: "August" },
    { month_num: 9, month_name: "September" },
    { month_num: 10, month_name: "October" },
    { month_num: 11, month_name: "November" },
    { month_num: 12, month_name: "December" }
  ];
 
  const filledData = months.map(month => {
    const monthData = payrollData.find(data => data.month_name === month.month_name);
    return monthData || {
      month_name: month.month_name,
      total_gross: 0,
      total_adjusted_netpay: 0
    };
  });
 
  const chartData = {
    labels: filledData.map(data => data.month_name),
    datasets: [
      {
        label: 'Total Gross',
        data: filledData.map(data => Number(data.total_gross) || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Total Adjusted Netpay',
        data: filledData.map(data => Number(data.total_adjusted_netpay) || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: `Payroll Totals for ${year}`,
        font: {
          size: 20
        }
      }
    }
  };

  return (
    <>
        <div className="  mt-2 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="container mx-auto p-4 relative overflow-x-auto no-scrollbar">
                <h2 className='text-lg font-semibold mb-5 text-gray-800 dark:text-white uppercase'>Payroll Totals for {year}</h2>
 
                <DatePicker
                    picker="year"
                    onChange={handleYearChange}
                    defaultValue={dayjs(year.toString())}  
                    className="h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
 
                {loading && <Spin size="large" />}
 
                {!loading && filledData.length > 0 && (
                    <div>
                    <Bar data={chartData} options={chartOptions} height={172} />
                    </div>
                )}
 
                {!loading && filledData.length === 0 && <div>No data available for this year.</div>}
            </div>
        </div>
    </>
    
  );
};

export default MonthlyTotal_Gross_Netpay;
