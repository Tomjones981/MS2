import React, { useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import GaugeChart from "react-gauge-chart";

const TryLang = () => {
  const [month, setMonth] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendancePresentPercentage, setAttendancePresentPercentage] = useState(null);
  const [attendanceAbsentPercentage, setAttendanceAbsentPercentage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const fetchAttendanceData = async (event) => {
    event.preventDefault();
    if (!month) {
      alert("Please select a month.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axiosClient.get(`/faculty/monthly/attendance11`, {
        params: { month },
      });
      setAttendanceData(response.data);

      let totalPresent = 0;
      let totalAbsent = 0;

      response.data.forEach((faculty) => {
        totalPresent += faculty.total_present;
        totalAbsent += faculty.total_absent;
      });

      const totalDays = totalPresent + totalAbsent;
      if (totalDays > 0) {
        const presentPercentage = ((totalPresent / totalDays) * 100).toFixed(2);
        const absentPercentage = ((totalAbsent / totalDays) * 100).toFixed(2);

        setAttendancePresentPercentage(presentPercentage);
        setAttendanceAbsentPercentage(absentPercentage);
      } else {
        setAttendancePresentPercentage(0);
        setAttendanceAbsentPercentage(0);
      }
    } catch (error) {
      setError("Failed to fetch attendance data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 m-full mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Faculty Monthly Attendance
      </h1>

      <div className="flex items-center justify-start mb-6">
        <div className=" ">
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Select Month
          </label>
          <input
            type="month"
            id="month"
            value={month}
            onChange={handleMonthChange}
            className="block w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className=" flex justify-start ml-5 mt-4">
          <button
            onClick={fetchAttendanceData}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {attendancePresentPercentage !== null && attendanceAbsentPercentage !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
              Faculty Present Rate
            </h2>
            <div className="relative">
              <GaugeChart
                id="present-gauge"
                nrOfLevels={20}
                percent={attendancePresentPercentage / 100}
                colors={["#6b7280", "#6b7280", "#6b7280"]}
                arcWidth={0.4}
                textColor="#000"
                needleColor="#34568B"
                formatTextValue={(value) => `${value.toFixed(0)}%`}
              /> 
              <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                0%
              </div>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                100%
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">
              Faculty Absent Rate
            </h2>
            <div className="relative">
              <GaugeChart
                id="absent-gauge"
                nrOfLevels={20}
                percent={attendanceAbsentPercentage / 100}
                colors={["#f44336", "#ffa726", "#ffd54f"]}
                arcWidth={0.4}
                textColor="#000"
                needleColor="#34568B"
                formatTextValue={(value) => `${value.toFixed(0)}%`}
              /> 
              <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                0%
              </div>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                100%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryLang;
