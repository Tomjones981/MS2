import React, { useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import { HiFolderDownload } from "react-icons/hi";

export const  Export_Fac = () => {
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleExport = async () => {
    await axiosClient
      .get("/export/faculty/data", { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "faculty_departments.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none dark:focus:ring-yellow-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >{isHovered ? (
        <span className="text-xs text-white ">Export</span>
      ) : (
        <HiFolderDownload size={30}/>
      )}
      </button>
    </div>
  );
};
