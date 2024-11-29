"use client";

import Navbar from "@/components/UI/Navbar/Navbar"; // Globala navbar-komponenten
import Footer from "@/components/UI/Footer/Footer"; // Globala footer-komponenten
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Kontrollera om sidan är en del av dashboard
  const isDashboard = pathname.startsWith("/Dashboard");

  return (
    <html lang="en">
      <body>
        {/* Visa bara den globala navbaren om vi inte är i dashboard */}
        {!isDashboard && <Navbar />}

        {/* Main Content */}
        <div style={{ paddingTop: !isDashboard ? "64px" : "0" }}>
          {children}
        </div>

        {/* Footer */}
        {!isDashboard && <Footer />}
        
      </body>
    </html>
  );
}
