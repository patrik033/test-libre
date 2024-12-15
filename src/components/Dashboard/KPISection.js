import React from "react";

const KPISection = ({ data }) => {
  // console.log({data})
  if (!data) return null;

  const { totalSales, middleAge, avgIncome, totalCrimes } = data;

  return (
    <div className="kpi-container grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold">Totala Försäljningar</h3>
        <p className="text-3xl font-bold">{totalSales}</p>
      </div>
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold">Medelålder</h3>
        <p className="text-3xl font-bold">{middleAge} år</p>
      </div>
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold">Genomsnittlig Inkomst</h3>
        <p className="text-3xl font-bold">{avgIncome} tkr</p>
      </div>
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold">Antal Brott i År</h3>
        <p className="text-3xl font-bold">{totalCrimes}</p>
      </div>
    </div>
  );
};

export default KPISection;
