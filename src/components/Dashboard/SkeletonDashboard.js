import React from 'react';

const SkeletonDashboard = () => {
  return (
    <div className="dashboard-container p-3 bg-gray-100 animate-pulse">
      <h2 className="text-2xl font-bold mb-6 bg-gray-300 rounded w-1/3 h-6"></h2>

      {/* KPI-kort högst upp */}
      <div className="kpi-container grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="kpi-card bg-gray-300 p-4 rounded shadow text-center h-24"
          >
            <div className="h-4 bg-gray-400 rounded w-2/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-400 rounded w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Diagram-sektionen */}
      <div className="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="chart bg-gray-300 p-4 rounded shadow h-64"
          >
            <div className="h-6 bg-gray-400 rounded w-2/3 mx-auto mb-6"></div>
            <div className="h-40 bg-gray-400 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonDashboard;
