 
import React, { useState, useEffect } from "react";
import { DatePicker, Spin } from "antd";
import axiosClient from "../../../../../../api/axiosClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import moment from 'moment' 
const Age_Report_Graph = () => {
  const [year, setYear] = useState("2024"); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData("2024"); 
  }, []);
  
  const onChange = (date, dateString) => {
    if (dateString) {
      setYear(dateString);
      fetchData(dateString);
    }
  };

  const fetchData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/children-cases-age/${selectedYear}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const maxValue = Math.max(...data.map((item) => item.total_ages), 0);

  return (
    <div className="p-6  m-10 bg-white shadow-md rounded-md "> 
      
 
      {loading ? (
        <div className="flex justify-center mt-6">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-6 border border-gray-200"> 
            <div className="text-center">
            <h1 className="text-5xl font-extrabold text-red-700">CICL</h1>
            <h2 className="text-2xl font-bold text-gray-800">BY AGE</h2>
        </div>
    
        <div className="flex justify-center mt-4">
            <DatePicker
            onChange={onChange}
            picker="year"
            className="border border-gray-400 p-2 rounded-md"
            value={year ? moment(year, "YYYY") : null} 
            />
        </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} className="p-10 -ml-7"> 
              <CartesianGrid strokeDasharray="3 3" fill="#e3e6df" stroke="#ffffff" />

              <XAxis dataKey="age" tick={{ fill: "black", fontSize: 14 }} stroke="#b8120f" />
              <YAxis tick={{ fill: "black", fontSize: 14 }} allowDecimals={false} domain={[0, maxValue + 1]} stroke="#b8120f" />

              <Tooltip stroke="#2328a8" />
 
              <Bar dataKey="total_ages" fill="#FFD700" stroke="white" strokeWidth={3} barSize={50}>
                <LabelList dataKey="total_ages" position="center" fill="black" fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="p-20 -mt-[9rem]">
            <div className="h-10 bg-gradient-to-r from-red-700 to-red-500 mt-4"></div>
          </div>
        </div>
      )} 
    </div>
  );
};

export default Age_Report_Graph;
