"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaChevronDown } from "react-icons/fa";

const dashboardLinks = [
  {
    category: "Huvudsida",
    links:[
      {href: "/",label: "Main"}
    ]
  },
  {
    category: "Dashboard",
    links: [
      { href: "/Dashboard", label: "Översikt" },
      { href: "/Dashboard/Settings", label: "Inställningar" },
    ],
  },
  {
    category: "Statistics",
    links: [
      { href: "/Dashboard/Statistics", label: "Statistik" },
      { href: "/Dashboard/Comparison", label: "Comparison" },
    ],
  },
  {
    category: "Rapporter",
    links: [
      { href: "/Dashboard/Reports/Sales", label: "Försäljningsrapport" },
      { href: "/Dashboard/Reports/Activity", label: "Användaraktivitet" },
      { href: "/Dashboard/Reports/Performance", label: "Prestanda" },
    ],
  },
];

const DashboardNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const pathname = usePathname();
console.log(pathname)
  return (
    <div className="lg:hidden mb-8">
      <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16">
        <div className="font-bold">Dashboard</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <FaBars className="text-xl" />
        </button>
      </nav>
      {isOpen && (
        <div className="bg-gray-800 text-white fixed top-16 left-0 w-full z-40 ">
          <nav className="flex flex-col space-y-4 p-4">
            {dashboardLinks.map((group) => (
              <div key={group.category}>
                <button
                  onClick={() =>
                    setExpandedGroup(expandedGroup === group.category ? null : group.category)
                  }
                  className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-gray-700"
                >
                  <span>{group.category}</span>
                  <FaChevronDown
                    className={`transition-transform ${
                      expandedGroup === group.category ? "rotate-180" : ""
                    }`}
                  />
                </button>

              
                {expandedGroup === group.category && (
                  <div className="pl-4 space-y-2 mt-2">
                    {group.links.map((link) => (
                     
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block p-2 rounded ${
                          pathname === link.href
                            ? "bg-primary text-white"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default DashboardNavbar;
