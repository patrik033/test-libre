"use client";

import DashboardNavbar from "./DashboardNavbar"; // Specifik navbar för dashboard
import DashboardSidebar from "./DashboardSidebar"; // Dashboard-sidomeny
//import "./dashboard.css"; // Valfri dashboard-specifik CSS
import Footer from "@/components/UI/Footer/Footer";
export default function Layout({ children }) {
  return (
    <div className="d-flex">
      {/* Sidebar för större skärmar */}
      <DashboardSidebar />

      {/* Huvudinnehåll */}
      <div
        style={{
          marginLeft: "200px", // Justera för sidomenyn
          width: "100%",
          paddingTop: "56px", // Kompensera för DashboardNavbar-höjden
        }}
      >
        <DashboardNavbar />
        <main>{children}</main>
<Footer/>
      </div>
    </div>
  );
}
