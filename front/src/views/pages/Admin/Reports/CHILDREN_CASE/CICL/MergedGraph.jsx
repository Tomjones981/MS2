 
import React, { useState, useEffect } from "react";
import { DatePicker, Spin } from "antd";
import axiosClient from "../../../../../../api/axiosClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import { Pie } from "react-chartjs-2";
import dayjs from "dayjs";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Legend, ChartDataLabels);

const MergedGraph = () => {
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


  const onChange = (date, dateString) => {
    if (dateString) {
      setYear(parseInt(dateString));  
    }
  };
  const handleCaseTypeChange = (event) => {
    setCaseType(event.target.value);
  };
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
  
  const maxLocationValue = locationData?.length ? Math.max(...locationData.map((item) => item.total_code_names), 0) : 0;
  const maxCaseValue = caseData?.length ? Math.max(...caseData.map((item) => item.total_case), 0) : 0;
  const maxAgeValue = ageData?.length ? Math.max(...ageData.map((item) => item.total_ages), 0) : 0;
  

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
    <div className="p-6 m-10 bg-white   rounded-md dark:bg-gray-800"> 
      <div className="flex justify-center mt-4 space-x-4"> 
        <div>
          <label className="block mb-1 text-md font-medium text-gray-900 dark:text-gray-200">Filter Children Case Type</label>
          <select onChange={(e) => setCaseType(e.target.value)} value={caseType} className="h-10 border border-gray-100 p-2 rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
            <option value="">Select Children Case Type</option>
            {["CICL", "CAR", "RC", "AC"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-center mt-7">
            <DatePicker
                onChange={onChange}
                picker="year"
                value={year ? dayjs().year(year) : null}  
                className="border border-gray-100 p-2 rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />

        </div>
      </div>
      {loading ? (
        <div className="flex justify-center mt-6">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className=" mt-6 border border-gray-100  rounded-lg dark:border-gray-700 p-4"> 
                <h1 className="text-center text-5xl font-extrabold text-red-700">{caseType || "All Children Cases"}</h1>
                <h2 className="text-center text-2xl font-light text-gray-800 dark:text-gray-200">Cases by Location</h2>
            
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={locationData} className="p-10 -ml-7">
                <CartesianGrid strokeDasharray="3 3" fill="#e3e6df" stroke="#ffffff" />
                <XAxis dataKey="locations" tick={{ fill: "black" }} stroke="#b8120f" />
                <YAxis allowDecimals={false} stroke="#b8120f" />
                <Tooltip />
                <Bar dataKey="total_code_names" fill="#FFD700" stroke="white" strokeWidth={3} barSize={50}>
                  <LabelList dataKey="total_code_names" position="center" fill="black" fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-20 -mt-[9rem]">
            <div className="h-10 bg-gradient-to-b from-red-900 via-red-600 to-red-900 hover:bg-gradient-to-bl mt-4"></div>
          </div>

          
          <div className="mt-6 border border-gray-100  rounded-lg dark:border-gray-700 p-4">
            <h1 className="text-center text-5xl font-extrabold text-red-700">{caseType || "All Children Cases"}</h1>
            <h2 className="text-center text-2xl font-light text-gray-800 dark:text-gray-200">Cases by Case</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={caseData} className="p-10 -ml-7">
                <CartesianGrid strokeDasharray="3 3" fill="#e3e6df" stroke="#ffffff" />
                <XAxis dataKey="" tick={{ fill: "black" }} stroke="#b8120f" />
                <YAxis allowDecimals={false} stroke="#b8120f" />
                <Tooltip />
                <Bar dataKey="total_case" fill="#FFD700" stroke="white" strokeWidth={3} barSize={50}>
                  <LabelList dataKey="case" position="inside" fill="black" fontWeight="normal" angle={-90}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-20 -mt-[9rem]">
            <div className="h-10 bg-gradient-to-b from-red-900 via-red-600 to-red-900 hover:bg-gradient-to-bl mt-4"></div>
          </div>

          <div className="mt-6 border border-gray-100  rounded-lg dark:border-gray-700 p-4">
            <h1 className="text-center text-5xl font-extrabold text-red-700">{caseType || "All Children Cases"}</h1>
            <h2 className="text-center text-2xl font-light text-gray-800 dark:text-gray-200">Cases by Age</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={ageData} className="p-10 -ml-7">
                <CartesianGrid strokeDasharray="3 3" fill="#e3e6df" stroke="#ffffff" />
                <XAxis dataKey="age" tick={{ fill: "black" }} stroke="#b8120f" />
                <YAxis allowDecimals={false} stroke="#b8120f" />
                <Tooltip />
                <Bar dataKey="total_ages" fill="#FFD700" stroke="white" strokeWidth={3} barSize={50}>
                  <LabelList dataKey="total_ages" position="center" fill="black" fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-20 -mt-[9rem]">
            <div className="h-10 bg-gradient-to-b from-red-900 via-red-600 to-red-900 hover:bg-gradient-to-bl mt-4"></div>
          </div>


          <div className="mt-6 border border-gray-100  rounded-lg dark:border-gray-700 p-4">
            <div className="grid grid-cols-2 gap-5 mt-6  text-center p-4">  
              <h1 className="col-span-2 text-5xl font-extrabold text-red-700">
                {caseType || "All Children Cases"}
              </h1>
  
              <h2 className="text-2xl font-light text-gray-800 dark:text-gray-200">Gender Distribution</h2>
              <h2 className="text-2xl font-light text-gray-800 dark:text-gray-200">Educational Status Distribution</h2>
  
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
                <div className="flex justify-center items-center h-[300px] text-gray-500">
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

export default MergedGraph;
