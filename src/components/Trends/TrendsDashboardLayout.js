"use client";

import React, { useState } from "react";
import TrendDashboard from "./TrendDashboard.js"; // Importera TrendDashboard-komponenten
import { kommuner } from "@/app/Dashboard/Kommuner"; // Importera kommuner från fil

const TrendDashboardLayout = () => {
  const [selectedKommun, setSelectedKommun] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const [showTrends, setShowTrends] = useState(false);

  const yearsOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i); // Senaste 10 åren

  const handleKommunChange = (event) => {
    const selected = kommuner.find((k) => k.Kommun === event.target.value);
    setSelectedKommun(selected);
    setShowTrends(false);
  };

  const handleYearsChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    setSelectedYears(selected);
    setShowTrends(false);
  };

  const handleShowTrends = () => {
    if (selectedKommun && selectedYears.length > 0) {
      setShowTrends(true);
    }
  };

   kommuner.sort((a, b) => a.Kommunnamn.localeCompare(b.Kommunnamn));

  return (
    <div className="trend-dashboard-layout p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Trender per Kommun</h1>

      {/* Form för att välja kommun och år */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="kommun-select" className="block text-sm font-medium text-gray-700">
            Välj en kommun:
          </label>
          <select
            id="kommun-select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleKommunChange}
          >
            <option value="">-- Välj Kommun --</option>
            {kommuner.map((kommun) => (
              <option key={kommun.Kommun} value={kommun.Kommun}>
                {kommun.Kommunnamn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="years-select" className="block text-sm font-medium text-gray-700">
            Välj år:
          </label>
          <select
            id="years-select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            multiple
            size={5} // Antal synliga alternativ i listan
            onChange={handleYearsChange}
          >
            {yearsOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <small className="text-gray-500 block mt-2">Håll ned Ctrl för att välja flera år.</small>
        </div>
      </div>

      <button
        onClick={handleShowTrends}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!selectedKommun || selectedYears.length === 0}
      >
        Visa Trender
      </button>

      {/* Visa TrendDashboard om data är vald */}
      {showTrends && selectedKommun && selectedYears.length > 0 && (
        <TrendDashboard kommunId={selectedKommun.Kommun} years={selectedYears} />
      )}
    </div>
  );
};

export default TrendDashboardLayout;
