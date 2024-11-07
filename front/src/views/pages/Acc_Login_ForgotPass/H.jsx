import React from "react";

const H = () => {
  return (
    <header className="bg-white shadow-md py-4 px-4 flex items-center justify-between">
      <div className="text-gray-700 text-2xl font-semibold">Dashboard</div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type to search..."
          className="border rounded-lg py-2 px-4"
        />
        <div className="relative">
          <button className="relative block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none">
            <img
              className="h-full w-full object-cover"
              src="https://via.placeholder.com/150"
              alt="User avatar"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default H;
