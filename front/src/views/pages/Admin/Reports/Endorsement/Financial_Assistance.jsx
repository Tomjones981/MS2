import React, { useState } from "react";
import { DatePicker, Space, Button, message, Card, Typography, Spin } from "antd";
import axiosClient from "../../../../../api/axiosClient";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Financial_Assistance = () => {
  const [dates, setDates] = useState([]);
  const [amounts, setAmounts] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (dates, dateStrings) => {
    setDates(dateStrings);
  };

  const fetchTotalAmounts = async () => {
    if (!dates.length || !dates[0] || !dates[1]) {
      message.error("Please select a valid date range.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/logbook/total-amount", {
        start_date: dates[0],
        end_date: dates[1],
      });

      setAmounts(response.data);
    } catch (error) {
      message.error("Failed to fetch financial assistance data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto p-4  ">
      <Title level={3} className="text-center font-light mb-4">
        Financial Assistance Report
      </Title>
      
      <Space direction="vertical" size={16} className="w-full">
        <div className="flex items-center gap-3">
          <RangePicker onChange={handleDateChange} className="flex-1" />
          <Button type="primary" onClick={fetchTotalAmounts} loading={loading} className="font-light">
            Generate
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center mt-4">
            <Spin size="large" />
          </div>
        ) : (
          amounts && (
            <Card className="bg-gray-100 text-center shadow-md p-4 rounded-lg">
              <Text className="text-lg font-semibold font-light">Total Amounts:</Text>
              
              <div className="mt-3 text-left">
                <p className="font-light">📌 <b>Cash Assistance:</b> ₱{formatNumber(Number(amounts.cash_assistance).toFixed(2))}</p>
                <p className="font-light">📌 <b>Educational Assistance:</b> ₱{formatNumber(Number(amounts.educational).toFixed(2))}</p>
                <p className="font-light">📌 <b>Medical Assistance:</b> ₱{formatNumber(Number(amounts.medical_assistance).toFixed(2))}</p>
                <p className="font-light">📌 <b>Burial Assistance:</b> ₱{formatNumber(Number(amounts.burial_assistance).toFixed(2))}</p>
              </div>

              <Title level={3} className="text-green-600 mt-3">
                🏆 Total Overall: ₱{formatNumber(Number(amounts.total_overall).toFixed(2))}
              </Title>
            </Card>
          )
        )}
      </Space> 
    </Card>
  );
};

export default Financial_Assistance;
