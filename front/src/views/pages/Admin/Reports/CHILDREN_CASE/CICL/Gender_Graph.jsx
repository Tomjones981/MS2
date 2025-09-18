 
import React, { useState, useEffect } from "react";
import { DatePicker, Spin } from "antd";
import axiosClient from "../../../../../../api/axiosClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import moment from "moment";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border shadow-md rounded">
        <p className="text-gray-800 font-semibold">{`Location: ${payload[0].payload.locations || payload[0].payload.age}`}</p>
        <p className="text-red-700 font-bold">{`Total Cases: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Gender_Graph = () => {
  const [year, setYear] = useState(2024);
  const [caseType, setCaseType] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data when year or case type changes
  useEffect(() => {
    fetchData(year, caseType);
  }, [year, caseType]); // ✅ Now updates when year or caseType changes

  // Handle Year Change
  const onChange = (date, dateString) => {
    if (dateString) {
      setYear(parseInt(dateString)); // ✅ Ensure it's an integer
    }
  };

  // Handle Case Type Selection
  const handleCaseTypeChange = (event) => {
    setCaseType(event.target.value);
  };

  // Fetch Data from API
  const fetchData = async (selectedYear, selectedCaseType) => {
    setLoading(true);
    try {
      const [locationResponse, ageResponse] = await Promise.all([
        axiosClient.get(`/children-cases/${selectedYear}`, {
          params: { children_case_type: selectedCaseType },
        }),
        axiosClient.get(`/children-cases-age/${selectedYear}`, {
          params: { children_case_type: selectedCaseType },
        }),
      ]);
      setLocationData(locationResponse.data);
      setAgeData(ageResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
 
  const maxLocationValue = locationData.length ? Math.max(...locationData.map((item) => item.total_code_names), 0) : 0;
  const maxAgeValue = ageData.length ? Math.max(...ageData.map((item) => item.total_ages), 0) : 0;

  return (
    <div className="p-6 m-10 bg-white shadow-md rounded-md"> 
      <div className="flex justify-center mt-4 space-x-4"> 
        <div>
          <label htmlFor="children_case_type" className="block mb-1 text-md font-medium text-gray-900">
            Filter Children Case Type
          </label>
            <select name="children_case_type" onChange={handleCaseTypeChange} value={caseType} className="h-10 border border-gray-400 p-2 rounded-md">
            <option value="">Select Children Case Type</option>
            {["CICL", "CAR", "RC", "AC"].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
 
        <div className="flex justify-center mt-7">
          <DatePicker
            onChange={onChange}
            picker="year"
            className="border border-gray-400 h-10 rounded-md"
            value={year ? moment(year, "YYYY") : null}
          />
        </div>
      </div>
 
      {loading ? (
        <div className="flex justify-center mt-6">
          <Spin size="large" />
        </div>
      ) : (
        <> 
          <div className="mt-6 border border-gray-200">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-red-700">{caseType || "All Children Cases"}</h1>
              <h2 className="text-2xl font-bold text-gray-800">BY LOCATION</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={locationData} className="p-10 -ml-7">
                <CartesianGrid strokeDasharray="3 3" fill="#e3e6df" stroke="#ffffff" />
                <XAxis dataKey="locations" tick={{ fill: "black", fontSize: 14 }} stroke="#b8120f" />
                <YAxis tick={{ fill: "black", fontSize: 14 }} allowDecimals={false} domain={[0, maxLocationValue + 1]} stroke="#b8120f" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_code_names" fill="#FFD700" stroke="white" strokeWidth={3} barSize={50}>
                  <LabelList dataKey="total_code_names" position="center" fill="black" fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
  
          <div className="mt-6 border border-gray-200">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold text-red-700">{caseType || "All Children Cases"}</h1>
              <h2 className="text-2xl font-bold text-gray-800">BY AGE</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={ageData} className="p-10 -ml-7">
                <CartesianGrid strokeDasharray="3 3" fill="#e3e6df" stroke="#ffffff" />
                <XAxis dataKey="age" tick={{ fill: "black", fontSize: 14 }} stroke="#b8120f" />
                <YAxis tick={{ fill: "black", fontSize: 14 }} allowDecimals={false} domain={[0, maxAgeValue + 1]} stroke="#b8120f" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_ages" fill="#FFD700" stroke="white" strokeWidth={3} barSize={50}>
                  <LabelList dataKey="total_ages" position="center" fill="black" fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Gender_Graph;


 