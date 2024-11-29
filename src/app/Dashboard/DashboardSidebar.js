"use client";

import React from "react";
import { Nav } from "react-bootstrap";
import { FaHome, FaChartBar, FaCog } from "react-icons/fa";

const DashboardSidebar = () => (
  <div
    className="d-none d-lg-flex flex-column bg-dark text-white p-3"
    style={{ width: "200px", height: "100vh", position: "fixed" }}
  >
    <h5 className="text-center">Dashboard</h5>
    <Nav className="flex-column">
      <Nav.Link href="/Dashboard" className="text-white">
        <FaHome /> Home
      </Nav.Link>
      <Nav.Link href="/Dashboard/Statistics" className="text-white">
        <FaChartBar /> Statistics
      </Nav.Link>
      <Nav.Link href="/Dashboard/Settings" className="text-white">
        <FaCog /> Settings
      </Nav.Link>
    </Nav>
  </div>
);

export default DashboardSidebar;
