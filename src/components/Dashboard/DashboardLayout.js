"use client";

import React, { useState } from "react";
import Dashboard from "@/app/Dashboard/Dashboard"; // Förladdad huvudkomponent

const components = {
  Statistik: () => import("./Statistics"),
  Inställningar: () => import("./Settings"),
};

export default function DashboardLayout() {
  const [activeKey, setActiveKey] = useState("Home");
  const [Component, setComponent] = useState(() => Dashboard);

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
      <div style={{ background: "#fff", minHeight: "360px" }}>
        <Component />
      </div>
    </div>
  );
}
