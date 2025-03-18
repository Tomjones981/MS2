
import React, { useState } from "react";
import { DatePicker, Space, Button, message, Card, Typography, Spin } from "antd";
import axiosClient from "../../../../../api/axiosClient";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Hospital_Bill_Report = () => {
  const [dates, setDates] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (dates, dateStrings) => {
    setDates(dateStrings);
  };

  const fetchTotalAmount = async () => {
    if (!dates.length || !dates[0] || !dates[1]) {
      message.error("Please select a valid date range.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post("/logbook-hospital-bill-total-amount", {
        start_date: dates[0],
        end_date: dates[1],
      });

      setTotalAmount(response.data.total_amount);
    } catch (error) {
      message.error("Failed to fetch total amount.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto p-2 shadow-lg rounded-xl">
      <Title level={3} className="text-center font-serif mb-4">
        Hospital Assistance Report
      </Title>
      
      <Space direction="vertical" size={16} className="w-full">
        <div className="flex items-center gap-3">
          <RangePicker onChange={handleDateChange} className="flex-1" />
          <Button type="primary" onClick={fetchTotalAmount} loading={loading} className="font-serif">
            Generate
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center mt-4">
            <Spin size="large" />
          </div>
        ) : (
          totalAmount !== null && (
            <Card className="bg-gray-100 text-center shadow-md p-4 rounded-lg">
              <Text className="text-lg font-semibold font-serif">Total Amount:</Text>
              <Title level={2} className="text-green-600 ">
                ₱{formatNumber(Number(totalAmount).toFixed(2))}
              </Title>
            </Card>
          )
        )}
      </Space>
    </Card>
  );
};

export default Hospital_Bill_Report;
