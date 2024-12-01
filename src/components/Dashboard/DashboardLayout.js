"use client";

import React, { useState } from "react";
import Dashboard from "@/app/Dashboard/Dashboard"; // Förladdad huvudkomponent
import styles from './DashboardLayout.module.css';
import SkeletonDashboard from "./SkeletonDashboard";

const kommuner = [
  { "kommun": "2084", "kommunnamn": "Avesta" },
  { "kommun": "1460", "kommunnamn": "Bengtsfors" },
  { "kommun": "2326", "kommunnamn": "Berg" },
  { "kommun": "2403", "kommunnamn": "Bjurholm" },
  { "kommun": "1260", "kommunnamn": "Bjuv" },
  { "kommun": "2582", "kommunnamn": "Boden" },
  { "kommun": "1443", "kommunnamn": "Bollebygd" },
  { "kommun": "2183", "kommunnamn": "Bollnäs" },
  { "kommun": "0885", "kommunnamn": "Borgholm" },
  { "kommun": "2081", "kommunnamn": "Borlänge" },
  { "kommun": "1490", "kommunnamn": "Borås" },
  { "kommun": "0127", "kommunnamn": "Botkyrka" },
  { "kommun": "0560", "kommunnamn": "Boxholm" },
  { "kommun": "1272", "kommunnamn": "Bromölla" },
  { "kommun": "2305", "kommunnamn": "Bräcke" },
  { "kommun": "1231", "kommunnamn": "Burlöv" },
  { "kommun": "1278", "kommunnamn": "Båstad" },
  { "kommun": "1438", "kommunnamn": "Dals-Ed" },
  { "kommun": "0162", "kommunnamn": "Danderyd" },
  { "kommun": "1862", "kommunnamn": "Degerfors" },
  { "kommun": "2425", "kommunnamn": "Dorotea" },
  { "kommun": "1730", "kommunnamn": "Eda" },
  { "kommun": "0125", "kommunnamn": "Ekerö" },
  { "kommun": "0686", "kommunnamn": "Eksjö" },
  { "kommun": "0862", "kommunnamn": "Emmaboda" },
  { "kommun": "0381", "kommunnamn": "Enköping" },
  { "kommun": "0484", "kommunnamn": "Eskilstuna" },
  { "kommun": "1285", "kommunnamn": "Eslöv" },
  { "kommun": "1445", "kommunnamn": "Essunga" },
  { "kommun": "1982", "kommunnamn": "Fagersta" },
  { "kommun": "1382", "kommunnamn": "Falkenberg" },
  { "kommun": "1499", "kommunnamn": "Falköping" },
  { "kommun": "2080", "kommunnamn": "Falun" }
]


const handleKommunChange = (event) => {
  const selected = kommuner.find((k) => k.kommunnamn === event.target.value);
  setSelectedKommun(selected);
};

const components = {
  Statistik: () => import("./Statistics"),
  Inställningar: () => import("./Settings"),
};

export default function DashboardLayout() {
  const [selectedKommun, setSelectedKommun] = useState(null);
  const [activeKey, setActiveKey] = useState("Home");
  const [Component, setComponent] = useState(() => Dashboard);
  const [loading, setLoading] = useState(true);



  const handleKommunChange = (event) => {
    const selected = kommuner.find((k) => k.kommunnamn === event.target.value);
    setLoading(false);
    setSelectedKommun(selected);
  };

  const handleMenuClick = async (key) => {
    if (key !== activeKey) {
      if (key === "Home") {
        setComponent(() => Dashboard);
      } else if (components[key]) {
        const { default: LoadedComponent } = await components[key]();
        setComponent(() => LoadedComponent);
      }
      setActiveKey(key);
    }
  };

  const menuItems = [
    { key: "Home", label: "Home" },
    { key: "Statistik", label: "Statistik" },
    { key: "Inställningar", label: "Inställningar" },
  ];

  return (
    <div className="dashboard-content p-8">
      <h2>{menuItems.find((item) => item.key === activeKey)?.label || "Dashboard"}</h2>

      {/* Dropdown för att välja kommun */}
      <div className="mb-6">
        <label htmlFor="kommun-select" className="block text-sm font-medium text-gray-700">
          Välj en kommun:
        </label>
        <select
          id="kommun-select"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleKommunChange}
        >
          <option value="">-- Välj Kommun --</option>
          {kommuner.map((kommun) => (
            <option key={kommun.kommun} value={kommun.kommunnamn}>
              {kommun.kommunnamn}
            </option>
          ))}
        </select>
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
