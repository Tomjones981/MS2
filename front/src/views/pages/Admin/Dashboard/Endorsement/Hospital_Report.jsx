 
import React, { useState } from "react";
import { DatePicker, Space, Button, message, Card, Typography, Spin } from "antd";
import axiosClient from "../../../../../api/axiosClient";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Hospital_Report = () => {
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
    <div className=" p-2 bg-white rounded-md p-4 dark:bg-gray-800">
      <Title level={3} className="text-center font-light mb-4 dark:text-gray-200">
        Hospital Bill Report
      </Title>
      
      <Space direction="vertical" size={16} className="w-full">
        <div className=" gap-3">
          <RangePicker onChange={handleDateChange} className="mr-2 flex-1 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200" />
          <Button type="primary" onClick={fetchTotalAmount} loading={loading} className="font-light">
            Generate
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center mt-4">
            <Spin size="large" />
          </div>
        ) : (
          totalAmount !== null && (
            <Card className="bg-white border border-gray-100 text-center -md p-4 rounded-lg dark:bg-gray-800 dark:border-gray-700 ">
              <Text className="text-lg font-normal dark:text-gray-200">Total Amount:</Text>
              <Title level={2} className="text-green-600 font-normal dark:text-gray-200 ">
                ₱{formatNumber(Number(totalAmount).toFixed(2))}
              </Title>
            </Card>
          )
        )}
      </Space>
    </div>
  );
};

export default Hospital_Report;
