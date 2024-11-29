"use client";

import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";

const DashboardNavbar = () => (
  <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="w-100">
    <Navbar.Brand href="/Dashboard">Dashboard</Navbar.Brand>
    <Nav className="ms-auto">
      <Nav.Link href="/Dashboard/Statistics">Statistics</Nav.Link>
      <Nav.Link href="/Dashboard/Settings">Settings</Nav.Link>
    </Nav>
  </Navbar>
);

export default DashboardNavbar;
