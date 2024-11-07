import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axiosClient from "../../../../api/axiosClient";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");  
  const [designationFilter, setDesignationFilter] = useState(""); 

  useEffect(() => {
    axiosClient
      .get("/schedules")
      .then((response) => {
        const events = response.data.map((schedule) => ({
          id: schedule.id,
          title: schedule.description,
          start: new Date(`${schedule.date_from}T${schedule.time_start}`),
          end: new Date(`${schedule.date_to}T${schedule.time_end}`),
        }));
        setEvents(events);
      })
      .catch((error) => {
        console.error("There was an error fetching the schedules!", error);
      });
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const response = await axiosClient.get("/getFacultyData");
      if (Array.isArray(response.data)) {
        const dataWithIds = response.data.map((faculty, index) => ({
          ...faculty,
          id: faculty.id || index,
        }));
        setFaculty(dataWithIds);
      } else {
        console.error(
          "Expected an array of faculty data, received:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    if (!selectedFaculty) {
      alert("Please select a faculty member first!");
      return;
    }

    const description = window.prompt("Enter event description");

    if (description) {
      axiosClient
        .post("/schedules", {
          faculty_id: selectedFaculty,
          date_from: moment(start).format("YYYY-MM-DD"),
          date_to: moment(end).format("YYYY-MM-DD"),
          time_start: moment(start).format("HH:mm:ss"),
          time_end: moment(end).format("HH:mm:ss"),
          description: description,
        })
        .then((response) => {
          setEvents([
            ...events,
            {
              id: response.data.id,
              title: description,
              start: time_start,
              end: time_end,
            },
          ]);
        })
        .catch((error) => {
          console.error("There was an error creating the schedule!", error);
        });
    }
  };

  const filteredFaculty = faculty.filter(
    (facultyMember) =>
      `${facultyMember.first_name} ${facultyMember.middle_name} ${facultyMember.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (designationFilter === "" ||
        facultyMember.designation === designationFilter)
  );

  return (
    <div className="p-2 mt-4 border border-slate-200 shadow bg-white rounded-xl dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
      <div className="m-2 ">
        <label c>Select Faculty: </label>
        <select className="dark:bg-gray-800 border border-slate-200   bg-white rounded-md"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
        >
          <option value="">Select Faculty</option>
          {filteredFaculty.map((fac) => (
            <option key={fac.id} value={fac.id}>
              {`${fac.first_name} ${fac.middle_name} ${fac.last_name}`}
            </option>
          ))}
        </select>
      </div>
      <Calendar 
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default MyCalendar;
