 
import React, { useState } from "react";
import { DatePicker, Table } from "antd";
import axiosClient from '../../../../../../api/axiosClient'
import CICL_Graph from "./CICL_Graph";
const { Column } = Table;

const CICL_Report = () => {
  const [year, setYear] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = (date, dateString) => {
    if (dateString) {
      setYear(dateString);
      fetchData(dateString);
    }
  };

  const fetchData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/children-cases/${selectedYear}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="">
      <h2>Children Case Report</h2>
      <DatePicker onChange={onChange} picker="year" />
      <Table dataSource={data} loading={loading} rowKey="locations" style={{ marginTop: 20 }}>
        <Column title="Location" dataIndex="locations" key="locations" />
        <Column title="Total Code Names" dataIndex="total_code_names" key="total_code_names" />
      </Table>
    <div className="grid grid-cols-10">
        <div className="col-span-10">
            <CICL_Graph />
        </div>
    </div>
    </div>
  );
};

export default CICL_Report;
