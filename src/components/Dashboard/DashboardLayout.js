"use client";

import React, { useState } from "react";
import Dashboard from "@/app/Dashboard/Dashboard"; // Förladdad huvudkomponent
import SkeletonDashboard from "./SkeletonDashboard";
import { kommuner } from "@/app/Dashboard/utils/Kommuner";

export default function DashboardLayout() {
  const [selectedKommun, setSelectedKommun] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleKommunChange = (event) => {
    const selected = kommuner.find((k) => k.Kommunnamn === event.target.value);
    setSelectedKommun(selected);
    setLoading(true);

    // Simulera laddning
    setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 sekund
  };

  // Sortera kommuner i alfabetisk ordning
  kommuner.sort((a, b) => a.Kommunnamn.localeCompare(b.Kommunnamn));

  return (
    <div className="dashboard-layout bg-gray-100 min-h-screen">
      {/* Header */}
     

      {/* Main Content */}
      <main className="pt-8 p-6 md:p-8">
        {/* Dropdown för att välja kommun */}
        <div className="mb-8 max-w-lg mx-auto">
          <label
            htmlFor="kommun-select"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Välj en kommun:
          </label>
          <select
            id="kommun-select"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleKommunChange}
          >
            <option value="">-- Välj Kommun --</option>
            {kommuner.map((kommun) => (
              <option key={kommun.Kommun} value={kommun.Kommunnamn}>
                {kommun.Kommunnamn}
              </option>
            ))}
          </select>
        </div>

        {/* Visning av Dashboard */}
        {!selectedKommun ? (
          <div className="text-center">
            <p className="text-gray-500 mb-6">Välj en kommun för att visa Dashboard.</p>
            <SkeletonDashboard />
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Laddar data...</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dashboard kommun={selectedKommun} />
          </div>
        )}
      </main>
    </div>
  );
}
