"use client";

import React, { useState } from "react";
import Dashboard from "@/app/Dashboard/Dashboard"; // Förladdad huvudkomponent
import styles from './DashboardLayout.module.css';
import SkeletonDashboard from "./SkeletonDashboard";
import { kommuner } from "@/app/Dashboard/Kommuner";




export default function DashboardLayout() {
  const [selectedKommun, setSelectedKommun] = useState(null);
  const [activeKey, setActiveKey] = useState("Home");
  const [Component, setComponent] = useState(() => Dashboard);
  const [loading, setLoading] = useState(true);



  const handleKommunChange = (event) => {
    const selected = kommuner.find((k) => k.Kommunnamn === event.target.value);
    setLoading(false);
    setSelectedKommun(selected);
  };



  const menuItems = [
    { key: "Home", label: "Home" },
    { key: "Statistik", label: "Statistik" },
    { key: "Inställningar", label: "Inställningar" },
    { key: "Comparison", label: "Comparison" },
  ];

  kommuner.sort((a, b) => a.Kommunnamn.localeCompare(b.Kommunnamn));

  return (
    <div className="dashboard-content p-8 md: mt-8">
      <h2>{menuItems.find((item) => item.key === activeKey)?.label || "Dashboard"}</h2>

      {/* Dropdown för att välja kommun */}
      <div className="mb-6">
        <form className=" mr-auto">

          <label htmlFor="kommun-select" className="block text-sm font-medium text-gray-700">
            Välj en kommun:
          </label>
          <select
            id="kommun-select"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleKommunChange}
          >
            <option value="">-- Välj Kommun --</option>
            {kommuner.map((kommun) => (
              <option key={kommun.Kommun} value={kommun.Kommunnamn}>
                {kommun.Kommunnamn}
              </option>
            ))}
          </select>
        </form>
      </div>

      {/* Visa skeleton-laddare om ingen kommun är vald */}
      {!selectedKommun ? (
        // <div className={`min-h-[360px] bg-gray-200 rounded-lg flex items-center justify-center ${styles.skeleton}`}>


        <div>
          <SkeletonDashboard />
          <p className="text-gray-500">Välj en kommun för att visa Dashboard.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", minHeight: "360px" }}>
          <Component kommun={selectedKommun} />
        </div>
      )}
    </div>
  );
}
