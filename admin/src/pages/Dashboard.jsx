import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Cards for key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Total Sales</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">$25,340</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">New Orders</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">125</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">New Users</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">55</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Products in Stock</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">500+</p>
        </div>
      </div>

      {/* Placeholder for recent orders and other charts */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
        {/* Table or list for recent orders */}
        <p className="text-gray-500">Content for recent orders goes here.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sales Report Chart</h2>
        {/* Placeholder for a chart component */}
        <p className="text-gray-500">A chart showing sales data goes here.</p>
      </div>
    </div>
  );
};

export default Dashboard;