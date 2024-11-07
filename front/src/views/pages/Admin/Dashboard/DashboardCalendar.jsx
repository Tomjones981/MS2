import React, { useState } from 'react';

const DashboardCalendar = () => {
  const [date, setDate] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const monthStartDate = firstDayOfMonth.getDay();

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-2 dark:text-gray-100">
        <button className="text-blue-600 hover:text-blue-800" onClick={handlePrevMonth}>❮</button>
        <h2 className="text-lg font-semibold">{months[date.getMonth()]} {date.getFullYear()}</h2>
        <button className="text-blue-600 hover:text-blue-800" onClick={handleNextMonth}>❯</button>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button className="text-blue-600 hover:text-blue-800">Today</button>
        <button className="text-blue-600 hover:text-blue-800">Agenda</button>
        <button className="text-blue-600 hover:text-blue-800">Month</button>
        <button className="text-blue-600 hover:text-blue-800">Week</button>
        <button className="text-blue-600 hover:text-blue-800">Day</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center border-t border-gray-300">
        {daysOfWeek.map(day => (
          <div key={day} className="py-2 font-medium dark:text-gray-100">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center border-t border-gray-300 dark:text-gray-100">
        {[...Array(monthStartDate).keys()].map((_, index) => (
          <div key={`empty-${index}`} className="py-2 "></div>
        ))}
        {[...Array(daysInMonth).keys()].map(day => (
          <div 
            key={day} 
            className={`py-2 border border-gray-200 ${new Date().getDate() === day + 1 ? 'bg-purple-500 text-white rounded-full' : ''}`}
          >
            {day + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCalendar;
