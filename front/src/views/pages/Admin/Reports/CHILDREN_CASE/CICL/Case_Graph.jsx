import React, { useEffect, useState } from "react";
import { DatePicker, Spin } from "antd";
import axiosClient from "../../../../../../api/axiosClient";
import dayjs from "dayjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,LabelList  } from "recharts";

const Case_Graph = () => {
  const [year, setYear] = useState(2024);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = (date, dateString) => {
    if (dateString) {
      setYear(dateString);
      fetchData(dateString);
    }
  };

  useEffect(() => {
    fetchData(year);
  }, []);

  const fetchData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/children-cases-case-graph/${selectedYear}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2>Children Case</h2>
      <DatePicker onChange={onChange} picker="year" defaultValue={dayjs("2024")} />
      {loading ? (
        <Spin style={{ display: "block", marginTop: 20 }} />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="case" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_case" fill="#8884d8"/> 
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Case_Graph;
