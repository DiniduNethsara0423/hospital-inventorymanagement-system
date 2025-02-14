"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Import icons for menu toggle

// Dynamically import components
const ByTable = dynamic(() => import("../../components/ByTable"));
const TableAndUserId = dynamic(() => import("../../components/TableAndUserId"));
const Action = dynamic(() => import("../../components/Action"));
const UserId = dynamic(() => import("../../components/UserId"));
const TableAndDate = dynamic(() => import("../../components/TableAndDate"));
const DateComponent = dynamic(() => import("../../components/Date"));

const Page: React.FC = () => {
  const [currentComponent, setCurrentComponent] = useState<string>("ByTable");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const navigationItems = [
    { name: "By Table", key: "ByTable" },
    { name: "By Table And User ID", key: "TableAndUserId" },
    { name: "By Action", key: "Action" },
    { name: "By User ID", key: "UserId" },
    { name: "By Table And Date", key: "TableAndDate" },
  ];

  const renderComponent = () => {
    switch (currentComponent) {
      case "ByTable":
        return <ByTable />;
      case "TableAndUserId":
        return <TableAndUserId />;
      case "Action":
        return <Action />;
      case "UserId":
        return <UserId />;
      case "TableAndDate":
        return <TableAndDate />;
      case "DateComponent":
        return <DateComponent />;
      default:
        return <ByTable />;
    }
  };

  return (
    <div className="p-6 mt-2 min-h-screen text-gray-900">
      {/* Navigation */}
      <nav className="mb-6">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex justify-between items-center bg-white p-3 rounded-lg shadow">
          <span className="text-lg font-semibold text-gray-800">Menu</span>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <ul className="lg:hidden flex flex-col gap-2 p-2 mt-2 bg-white rounded-lg shadow">
            {navigationItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => {
                    setCurrentComponent(item.key);
                    setIsMenuOpen(false); // Close menu after selection
                  }}
                  className={`block w-full px-4 py-2 text-base text-gray-700 font-medium rounded-lg transition-all duration-200 ${
                    currentComponent === item.key
                      ? "bg-gray-200 text-gray-900"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop Navigation (Hidden on Small Screens) */}
        <ul className="hidden lg:flex justify-center gap-4 p-2 bg-white rounded-lg">
          {navigationItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setCurrentComponent(item.key)}
                className={`px-6 py-2 text-base text-gray-700 font-medium rounded-lg transition-all duration-200 border-b-2 ${
                  currentComponent === item.key
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Component Content */}
      <div className="p-4 bg-white shadow-sm rounded-lg">{renderComponent()}</div>
    </div>
  );
};

export default Page;
