  
import React, { useState } from "react";
import { DatePicker, Table } from "antd";
import axiosClient from '../../../../../../api/axiosClient'
import CICL_Graph from "./CICL_Graph";
const { Column } = Table;

const Age_Report = () => {
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
        `/children-cases-age/${selectedYear}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="">
      <h2>Children AGE</h2>
      <DatePicker onChange={onChange} picker="year" />
      <Table dataSource={data} loading={loading} rowKey="age" style={{ marginTop: 20 }}>
        <Column title="Location" dataIndex="age" key="age" />
        <Column title="Total Code Names" dataIndex="total_ages" key="total_ages" />
      </Table>
    <div className="grid grid-cols-10">
        <div className="col-span-10">
            <CICL_Graph />
        </div>
    </div>
    </div>
  );
};

export default Age_Report;
