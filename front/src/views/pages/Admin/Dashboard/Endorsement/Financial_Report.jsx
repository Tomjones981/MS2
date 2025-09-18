import React, { useState } from "react";
import {
  DatePicker,
  Space,
  Button,
  message,
  Card,
  Typography,
  Spin,
} from "antd";
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosClient from "../../../../../api/axiosClient";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const Financial_Report = () => {
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

  const chartData = amounts
    ? [
        {
          name: "Cash",
          value: Number(amounts.cash_assistance),
          fill: "#3b82f6",
        },
        {
          name: "Educational",
          value: Number(amounts.educational),
          fill: "#10b981",
        },
        {
          name: "Medical",
          value: Number(amounts.medical_assistance),
          fill: "#f59e0b",
        },
        {
          name: "Burial",
          value: Number(amounts.burial_assistance),
          fill: "#ef4444",
        },
      ]
    : [];

  return (
    <div className="p-4 bg-white rounded-md dark:bg-gray-800 ">
      <Title level={3} className="text-center font-light mb-4 dark:text-gray-200">
        Financial Assistance Report
      </Title>

      <Space direction="vertical" size={16} className="w-full" >
        <div className=" ">
          <RangePicker onChange={handleDateChange} className="mr-2 flex-1 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 " />
          <Button
            type="primary"
            onClick={fetchTotalAmounts}
            loading={loading}
            className="font-light"
          >
            Generate
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center mt-4">
            <Spin size="large" />
          </div>
        ) : (
          amounts && (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 ">
              <Card className="bg-white text-center   p-4 rounded-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <Text className="text-lg font-semibold font-light dark:text-gray-200">
                  Total Amounts:
                </Text>

                <div className="mt-3 text-left">
                  <p className="font-light dark:text-gray-200">
                    📌 <b>Cash Assistance:</b> ₱
                    {formatNumber(Number(amounts.cash_assistance).toFixed(2))}
                  </p>
                  <p className="font-light dark:text-gray-200">
                    📌 <b>Educational Assistance:</b> ₱
                    {formatNumber(Number(amounts.educational).toFixed(2))}
                  </p>
                  <p className="font-light dark:text-gray-200">
                    📌 <b>Medical Assistance:</b> ₱
                    {formatNumber(Number(amounts.medical_assistance).toFixed(2))}
                  </p>
                  <p className="font-light dark:text-gray-200">
                    📌 <b>Burial Assistance:</b> ₱
                    {formatNumber(Number(amounts.burial_assistance).toFixed(2))}
                  </p>
                </div>

                <Title level={3} className="text-green-600 mt-3 text-left dark:text-gray-200">
                    Total Overall: ₱
                  {formatNumber(Number(amounts.total_overall).toFixed(2))}
                </Title>
              </Card>

              {chartData.length > 0 && (
                <Card className="  p-4 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700" >
                  <Title level={5} className="text-center mb-4 font-normal dark:text-gray-200">
                    Financial Breakdown Overview
                  </Title>

                  <div style={{ width: "100%", height: 250 }}>
                    <ResponsiveContainer>
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="30%"
                        outerRadius="90%"
                        barSize={15}
                        data={chartData}
                        startAngle={180}
                        endAngle={-180}
                      >
                        <RadialBar
                          minAngle={15}
                          label={{ position: "insideStart", fill: "#fff" }}
                          background
                          clockWise
                          dataKey="value"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          }}
                          itemStyle={{
                            color: "#111827",
                            fontWeight: "500",
                            marginBottom: "4px",
                          }}
                          labelStyle={{
                            color: "#6b7280",
                            fontSize: "13px",
                          }}
                          formatter={(value, name) => [
                            `₱${formatNumber(Number(value).toFixed(2))}`,
                            name,
                          ]}
                        />
                        <Legend
                          iconSize={10}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </div>
          )
        )}
      </Space>
    </div>
  );
};

export default Financial_Report;
