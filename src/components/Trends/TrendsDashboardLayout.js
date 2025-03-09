"use client";

import React, { useState } from "react";
import TrendDashboard from "./TrendDashboard.js";
import { kommuner } from "@/app/Dashboard/utils/Kommuner.js";

const TrendDashboardLayout = () => {
  const MAX_YEARS = 5; // Max antal år att välja
  const [selectedKommun, setSelectedKommun] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const [showTrends, setShowTrends] = useState(false);

  // Definiera specifika år
  const yearsOptions = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  // Sortera kommuner alfabetiskt
  kommuner.sort((a, b) => a.Kommunnamn.localeCompare(b.Kommunnamn));

  const handleKommunChange = (event) => {
    const selected = kommuner.find((k) => k.Kommun === event.target.value);
    setSelectedKommun(selected);
    setShowTrends(false);
  };

  const handleYearsChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    if (selected.length > MAX_YEARS) {
      alert(`Du kan bara välja upp till ${MAX_YEARS} år.`);
      return;
    }
    setSelectedYears(selected);
    setShowTrends(false);
  };

  const handleShowTrends = () => {
    if (selectedKommun && selectedYears.length > 0) {
      setShowTrends(true);
    }
  };


  // comparison-dashboard px-4 md:px-8 bg-gray-100 text-gray-800 text-white min-h-screen p-8
  // trend-dashboard-layout bg-gray-100 min-h-screen p-4 md:p-8
  return (
    <div className="trend-dashboard-layout md:px-8 bg-gray-100 text-gray-800  min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Kommuntrender
      </h1>

      {/* Val för kommun och år */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
        {/* Kommunval */}
        <div>
          <label
            htmlFor="kommun-select"
            className="block text-lg font-medium text-gray-700 mb-3"
          >
            Välj en kommun:
          </label>
          <select
            id="kommun-select"
            className="w-full bg-white border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            onChange={handleKommunChange}
            value={selectedKommun?.Kommun || ""}
          >
            <option value="">-- Välj kommun --</option>
            {kommuner.map((kommun) => (
              <option key={kommun.Kommun} value={kommun.Kommun}>
                {kommun.Kommunnamn}
              </option>
            ))}
          </select>
        </div>

        {/* Årval */}
        <div>
          <label
            htmlFor="years-select"
            className="block text-lg font-medium text-gray-700 mb-3"
          >
            Välj år:
          </label>
          <select
            id="years-select"
            className="w-full bg-white border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            multiple
            size={Math.min(yearsOptions.length, 5)} // Visar max 5 alternativ
            onChange={handleYearsChange}
            value={selectedYears.map((y) => String(y))}
          >
            {yearsOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <small className="block text-gray-500 mt-2">
            Håll Ctrl (Windows) eller Cmd (Mac) för att välja flera år. Max {MAX_YEARS} år.
          </small>
        </div>
      </div>

      {/* Visa trends */}
      <div className="flex justify-center">
        <button
          onClick={handleShowTrends}
          className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!selectedKommun || selectedYears.length === 0}
        >
          Visa trender
        </button>
      </div>

      {/* Rendera trend-dashboard */}
      {showTrends && selectedKommun && selectedYears.length > 0 && (
        <div className="mt-8">
          <TrendDashboard kommunId={selectedKommun.Kommun} years={selectedYears} />
        </div>
      )}
    </div>
  );
};

export default TrendDashboardLayout;
