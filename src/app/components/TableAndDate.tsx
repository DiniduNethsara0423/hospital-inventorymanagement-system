import React, { useState } from "react";
import { getLogsByTableAndDate } from "@/app/apis/logs/api";

const TableAndDate: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState("category_log");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTableChange = (table: string) => {
    setSelectedTable(table);
  };

  const fetchLogs = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getLogsByTableAndDate(
        currentPage.toString(),
        pageSize.toString(),
        selectedDate,
        selectedTable
      );
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };
  console.log(logs)

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchLogs();
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Table and Date Selector
      </h1>

      <div className=" bg-white p-6">
        {/* Dropdown for selecting table */}
        <div className="mb-6">
          <label htmlFor="tableSelector" className="block font-semibold text-gray-700 mb-2">
            Select Table:
          </label>
          <select
            id="tableSelector"
            value={selectedTable}
            onChange={(e) => handleTableChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="category_log">category_log</option>
            <option value="department_log">department_log</option>
            <option value="invoices_log">invoices_log</option>
            <option value="item_departments_log">item_departments_log</option>
            <option value="item_details_log">item_details_log</option>
            <option value="items_log">items_log</option>
            <option value="purchase_request_log">purchase_request_log</option>
            <option value="purchases_log">purchases_log</option>
            <option value="quotations_log">quotations_log</option>
            <option value="roles_log">roles_log</option>
            <option value="users_log">users_log</option>
            <option value="vendors_log">vendors_log</option>
          </select>
        </div>

        {/* Date input and search button */}
        <div className="mb-4">
          <label htmlFor="date" className="block font-semibold text-gray-700 mb-2">
            Enter Date (yyyy-mm-dd):
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchLogs}
              className="px-6 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
              Search
            </button>
          </div>
        </div>

        {/* Display logs */}
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-indigo-100">
                  {Object.keys(logs[0]).map((key) => (
                    <th key={key} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    {Object.values(log).map((value: any, idx) => (
                      <td key={idx} className="border border-gray-300 px-4 py-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No logs found.</p>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <label htmlFor="pageSize" className="font-semibold mr-2">
              Page Size:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setCurrentPage(1);
                fetchLogs();
              }}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(logs.length / pageSize) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-lg shadow-sm ${currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableAndDate;
