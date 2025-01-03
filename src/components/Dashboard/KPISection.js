import React from "react";

const KPISection = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center text-gray-500">
        <p>Ingen data tillgänglig för KPI:er.</p>
      </div>
    );
  }

  const { totalSales, middleAge, avgIncome, totalCrimes } = data;

  // Funktion för att formattera nummer
  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    return new Intl.NumberFormat("sv-SE").format(num);
  };

  return (
    <div className="kpi-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold text-gray-700">Totala Försäljningar</h3>
        <p className="text-3xl font-bold text-blue-600">{formatNumber(totalSales)}</p>
      </div>
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold text-gray-700">Medelålder</h3>
        <p className="text-3xl font-bold text-blue-500">{formatNumber(middleAge)} år</p>
      </div>
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold text-gray-700">Genomsnittlig Inkomst</h3>
        <p className="text-3xl font-bold text-blue-400">{formatNumber(avgIncome)} tkr</p>
      </div>
      <div className="kpi-card bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-semibold text-gray-700">Antal Brott i År</h3>
        <p className="text-3xl font-bold text-blue-300">{formatNumber(totalCrimes)}</p>
      </div>
    </div>
  );
};

export default KPISection;
