"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChartBar, FaCog, FaFileAlt, FaUsers, FaTools } from "react-icons/fa";

const dashboardLinks = [
  {
    category: "Huvudsida",
    links: [
      { href: "/", label: "Home", icon: <FaHome /> },
    ],
  },
  {
    category: "Dashboard",
    links: [
      { href: "/Dashboard", label: "Översikt", icon: <FaHome /> },
      { href: "/Dashboard/Settings", label: "Inställningar", icon: <FaCog /> },
    ],
  },
  {
    category: "Statistics",
    links: [
      { href: "/Dashboard/Statistics", label: "Statistik", icon: <FaChartBar /> },
      { href: "/Dashboard/Comparison", label: "Comparison", icon: <FaChartBar /> },

    ],
  },
  {
    category: "Rapporter",
    links: [
      { href: "/Dashboard/Reports/Sales", label: "Försäljningsrapport", icon: <FaFileAlt /> },
      { href: "/Dashboard/Reports/Activity", label: "Användaraktivitet", icon: <FaFileAlt /> },
      { href: "/Dashboard/Reports/Performance", label: "Prestanda", icon: <FaFileAlt /> },
    ],
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-64 bg-gray-800 text-white" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="text-center py-4 font-bold text-lg border-b border-gray-700">
        Dashboard
      </div>
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {dashboardLinks.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">{group.category}</h3>
            <div className="space-y-2">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center p-2 rounded transition ${
                    pathname === link.href
                      ? "bg-blue-600 text-white border-l-4 border-blue-500"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <span className="mr-2 text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
