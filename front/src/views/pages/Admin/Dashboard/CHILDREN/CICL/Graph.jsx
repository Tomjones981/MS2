 
import React, { useState, useEffect } from "react";
import { DatePicker, Spin } from "antd";
import axiosClient from '../../../../../../api/axiosClient'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import { Pie } from "react-chartjs-2";
import dayjs from "dayjs";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Legend, ChartDataLabels);

const Graph = () => {
//   const [year, setYear] = useState(dayjs().year());
  const [year, setYear] = useState(2024);
  const [caseType, setCaseType] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [educData, setEducData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(year, caseType);
  }, [year, caseType]);

 
  const fetchData = async (selectedYear, selectedCaseType) => {
    setLoading(true);
    try {
      const [locationResponse, ageResponse, genderResponse, caseResponse, educResponse] = await Promise.all([
        axiosClient.get(`/children-cases/${selectedYear}`, { params: { children_case_type: selectedCaseType } }),
        axiosClient.get(`/children-cases-age/${selectedYear}`, { params: { children_case_type: selectedCaseType } }),
        axiosClient.get(`/children-cases-sex/${selectedYear}`, { params: { children_case_type: selectedCaseType } }),
        axiosClient.get(`/children-cases-case-graph/${selectedYear}`, { params: { children_case_type: selectedCaseType } }),
        axiosClient.get(`/children-cases-educational-status-graph/${selectedYear}`, { params: { children_case_type: selectedCaseType } }),
      ]);
  
      setLocationData(locationResponse.data || []);  
      setAgeData(ageResponse.data || []);  
      setCaseData(caseResponse.data || []);  
      setEducData(formatEducChartData(educResponse.data || []));  
      setGenderData(formatGenderChartData(genderResponse.data || []));  
  
    } catch (error) {
      console.error("Error fetching data:", error); 
      setLocationData([]);
      setAgeData([]);
      setCaseData([]);
      setEducData([]);
      setGenderData([]);
    }
    setLoading(false);
  };
   

  const formatGenderChartData = (cases = []) => {
    if (!Array.isArray(cases)) return { labels: [], datasets: [] }; 
    return {
      labels: cases.map((item) => item.sex || "Unknown"),  
      datasets: [
        {
          label: "Gender Distribution",
          data: cases.map((item) => item.total_sex || 0),  
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverOffset: 4,
        },
      ],
    };
  };
  
  const formatEducChartData = (cases = []) => {
    if (!Array.isArray(cases)) return { labels: [], datasets: [] };  
    return {
      labels: cases.map((item) => item.educational_status || "Unknown"),  
      datasets: [
        {
          label: "Educational Status Distribution",
          data: cases.map((item) => item.total_educational_status || 0),  
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverOffset: 4,
        },
      ],
    };
  };
  
  
 

  return (
    <div className="p-6  mt-5 bg-white   rounded-md dark:bg-gray-800 dark:text-gray-200"> 
    <div className="flex justify-end">
        <a href="/admin/cicl/report" className=" flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg -md hover:bg-blue-700 transition">
            VIEW MORE GRAPH
        </a>
    </div>
      <div className="flex justify-center mt-4 space-x-4">  
      </div>
      {loading ? (
        <div className="flex justify-center mt-6">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className=" ">
            <div className="mt-6 border border-gray-100 rounded-lg p-2 dark:border-gray-700 "> 
              <h1 className="text-center text-5xl font-extrabold text-red-700">{caseType || "All Children Cases"}</h1>
              <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">Cases by Location</h2>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={locationData} className="p-10 -ml-7">
                  <CartesianGrid strokeDasharray="3 3" fill="#e3e6df" stroke="#ffffff" className="dark:text-gray-200"/>
                  <XAxis dataKey="locations" tick={{ fill: "black" }} stroke="#b8120f" className="dark:text-gray-200"/>
                  <YAxis allowDecimals={false} stroke="#b8120f" className="dark:text-gray-200"/>
                  <Tooltip className="dark:text-gray-200"/>
                  <Bar 
                    dataKey="total_code_names" 
                    fill="#FFD700"  
                    stroke="white" 
                    strokeWidth={3} 
                    barSize={50} 
                    className="dark:text-gray-200"
                  >
                    <LabelList 
                      dataKey="locations" 
                      position="inside"   
                      fill="black" 
                      fontWeight="normal" 
                      angle={-90}   
                      className="dark:text-gray-200"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div> 
            <div className="p-20 -mt-[9rem]">
              <div className="h-10 bg-gradient-to-b from-red-900 via-red-600 to-red-900 hover:bg-gradient-to-bl mt-4"></div>
            </div>
          </div>


          <div className="border border-gray-100 rounded-lg p-2 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-5 mt-6  text-center p-4">  
              <h1 className="col-span-2 text-5xl font-extrabold text-red-700">
                {caseType || "All Children Cases"}
              </h1>
  
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gender Distribution</h2>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Educational Status Distribution</h2>
  
              {genderData?.datasets?.length > 0 ? (
                <div className="flex justify-center">
                  <Pie
                    data={genderData}
                    options={{
                      plugins: {
                        legend: { position: "top" },
                        datalabels: {
                          color: "#fff",
                          font: { weight: "bold", size: 16 },
                          formatter: (value) => value,
                        },
                      },
                    }}
                    style={{ maxWidth: "400px", margin: "auto" }}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-[300px] text-gray-500 dark:text-gray-200">
                  No Gender Data Available
                </div>
              )}

              {educData?.datasets?.length > 0 ? (
                <div className="flex justify-center">
                  <Pie
                    data={educData}
                    options={{
                      plugins: {
                        legend: { position: "top" },
                        datalabels: {
                          color: "#fff",
                          font: { weight: "bold", size: 16 },
                          formatter: (value) => value,
                        },
                      },
                    }}
                    style={{ maxWidth: "400px", margin: "auto" }}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-[300px] text-gray-500 dark:text-gray-200">
                  No Educational Data Available
                </div>
              )}
            </div>
            <div className="p-20 -mt-[5rem]">
              <div className="h-10 bg-gradient-to-b from-red-900 via-red-600 to-red-900 hover:bg-gradient-to-bl mt-4"></div>
          </div>
          </div> 
        </>
      )}
    </div>
  );
};

export default Graph;
