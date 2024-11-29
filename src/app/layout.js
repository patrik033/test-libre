"use client";

import Navbar from "@/components/UI/Navbar/Navbar"; // Din globala navbar-komponent
import Footer from "@/components/UI/Footer/Footer"; // Din globala footer-komponent
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Wrapper */}
        <main
          className="min-h-screen"
          style={{
            paddingTop: "64px", // Kompensera för navbar-höjden
            //paddingBottom: "80px", // Kompensera för footer-höjden
          }}
        >
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
