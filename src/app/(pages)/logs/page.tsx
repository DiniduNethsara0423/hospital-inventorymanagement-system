"use client";

import React, { useState, useEffect } from "react";

interface Log {
  id: number;
  user: string;
  action: string;
  timestamp: string;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const dummyLogs = [
          {
            id: 1,
            user: "User A",
            action: "Added a new item",
            timestamp: "2025-01-01 10:00 AM",
          },
          {
            id: 2,
            user: "User B",
            action: "Added a new department",
            timestamp: "2025-01-01 11:30 AM",
          },
          {
            id: 3,
            user: "User C",
            action: "Added a new invoice",
            timestamp: "2025-01-01 12:15 PM",
          },
        ];
        setLogs(dummyLogs);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Activity Logs</h1>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading logs...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.user}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                  <td className="border border-gray-300 px-4 py-2">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
