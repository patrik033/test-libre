"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar as BootstrapNavbar, Nav, Button, Offcanvas, Container } from "react-bootstrap";

const Navbar = ({ onDashboardPage, dashboardLinks }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  return (
    <>
      <nav className="bg-black text-white fixed top-0 left-0 w-full z-50 h-16 flex items-center px-4 shadow">
        <div className="font-bold text-lg">Fastighetsplattform AB</div>
        <div className="ml-auto flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/Map" className="hover:text-gray-300">
            Map
          </Link>
          <Link href="/Dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
