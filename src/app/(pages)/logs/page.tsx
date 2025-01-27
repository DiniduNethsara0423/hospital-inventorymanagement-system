"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import components
const ByTable = dynamic(() => import("../../components/ByTable")); // done
const TableAndUserId = dynamic(() => import("../../components/TableAndUserId")); // done
const Action = dynamic(() => import("../../components/Action")); // done
const UserId = dynamic(() => import("../../components/UserId")); // done
const TableAndDate = dynamic(() => import("../../components/TableAndDate")); // done
const DateComponent = dynamic(() => import("../../components/Date")); // Renamed to avoid conflict with `Date`

const Page: React.FC = () => {
  const [currentComponent, setCurrentComponent] = useState<string>("ByTable");

  const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  const navigationItems = [
    { name: "By Table", key: "ByTable" },
    { name: "By Table And User ID", key: "TableAndUserId" },
    { name: "By Action", key: "Action" },
    { name: "By User ID", key: "UserId" },
    { name: "By Table And Date", key: "TableAndDate" },
    { name: "By Date", key: "DateComponent" },
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
    <div className="p-6 min-h-screen bg-white">
      {/* Navigation */}
      <ul className="flex flex-wrap gap-4 mb-6 justify-center">
        {navigationItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => setCurrentComponent(item.key)}
              className={`px-5 py-3 text-lg rounded-lg transition-all duration-200 ${
                currentComponent === item.key
                  ? " decoration-4"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Component Content */}
      <div className="bg-white">{renderComponent()}</div>
    </div>
  );
};

export default Page;
