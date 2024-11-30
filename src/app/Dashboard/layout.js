"use client";

import DashboardNavbar from "./DashboardNavbar"; // Specifik navbar för dashboard
import DashboardSidebar from "./DashboardSidebar"; // Dashboard-sidomeny
import Footer from "@/components/UI/Footer/Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar för mobila enheter */}
      <DashboardNavbar />

      {/* Huvudlayout (sidebar + content) */}
      <div className="flex flex-1">
        {/* Sidebar för större skärmar */}
        <DashboardSidebar />

        {/* Huvudinnehåll */}
        <main
          className="flex-1 p-4  overflow-y-auto"
          style={{
            marginTop: "64px", // Kompensera för navbarens höjd
            paddingBottom: "80px", // Kompensera för footerns höjd
          }}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
