import React from 'react'

const D = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-400">Total views</div>
        <div className="text-2xl font-bold">$3.456K</div>
        <div className="text-green-500">0.43% ↑</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-400">Total Profit</div>
        <div className="text-2xl font-bold">$45,2K</div>
        <div className="text-green-500">4.35% ↑</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-400">Total Product</div>
        <div className="text-2xl font-bold">2.450</div>
        <div className="text-green-500">2.59% ↑</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-400">Total Users</div>
        <div className="text-2xl font-bold">3.456</div>
        <div className="text-red-500">0.95% ↓</div>
      </div>
      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-400">Total Revenue</div>
        <div className="text-2xl font-bold">12.04.2022 - 12.05.2022</div>
        <div className="text-gray-400">Total Sales</div>
        {/* Insert your chart component here */}
      </div>
      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-400">Profit this week</div>
        <div className="text-2xl font-bold">This Week</div>
        {/* Insert your chart component here */}
      </div>
    </div>
  )
}

export default D