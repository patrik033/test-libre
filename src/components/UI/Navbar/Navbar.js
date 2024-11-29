"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar as BootstrapNavbar, Nav, Button, Offcanvas, Container } from "react-bootstrap";

const Navbar = ({ onDashboardPage, dashboardLinks }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  return (
    <>
      {/* Global Navbar */}
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" expand="lg" className="w-100">
        <Container>
          <BootstrapNavbar.Brand href="/">Fastighetsplattform AB Huvud</BootstrapNavbar.Brand>
          <Button
            variant="outline-light"
            className="d-lg-none"
            onClick={() => setShowOffcanvas(true)}
          >
            ☰
          </Button>
          <BootstrapNavbar.Collapse className="d-none d-lg-flex">
            <Nav className="ms-auto">
              <Link href="/" className="nav-link text-white">
                Home
              </Link>
              <Link href="/Map" className="nav-link text-white">
                Map
              </Link>
              <Link href="/Dashboard" className="nav-link text-white">
                Dashboard
              </Link>
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Dashboard-specific Offcanvas for small screens */}
      {onDashboardPage && (
        <Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="start"
          className="bg-dark text-white"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>Dashboard Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {dashboardLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-white ${
                    link.active ? "bg-primary" : ""
                  }`}
                  onClick={() => setShowOffcanvas(false)}
                >
                  {link.label}
                </Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Dashboard-specific Links on larger screens */}
      {onDashboardPage && (
        <div
          className="bg-dark text-white d-none d-lg-flex align-items-center justify-content-center py-2"
          style={{ marginTop: "56px" }}
        >
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 text-white ${
                link.active ? "text-primary font-bold" : "hover:text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
