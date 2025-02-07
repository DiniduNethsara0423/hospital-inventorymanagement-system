import React, { useState } from "react";
import { getLogsByDate } from "@/app/apis/logs/api";

const DatePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedDate, setSelectedDate] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    if (!selectedDate) {
      alert("Please enter a valid date in yyyy-mm-dd format.");
      return;
    }

    try {
      const data = await getLogsByDate(
        currentPage.toString(),
        pageSize.toString(),
        selectedDate
      );
      setLogs(data || []);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        View Logs by Date
      </h1>

      {/* Date Input */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <label htmlFor="date" className="block text-lg font-medium mb-2 text-gray-700">
          Select Date:
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={fetchLogs}
            className="px-6 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </div>
        <p className="mt-3 text-gray-500">
          Selected Date: {selectedDate || "None"}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              {logs.length > 0 &&
                Object.keys(logs[0]).map((key) => (
                  <th
                    key={key}
                    className="border px-4 py-2 text-left text-gray-600 font-semibold"
                  >
                    {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {Object.values(log).map((value:any, idx) => (
                    <td
                      key={idx}
                      className="border px-4 py-2 text-gray-700"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-4 text-gray-500 font-medium"
                >
                  No logs found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <label htmlFor="pageSize" className="mr-2 font-medium text-gray-700">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} 
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePage;
