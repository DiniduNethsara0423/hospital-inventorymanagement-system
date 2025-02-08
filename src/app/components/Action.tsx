import React, { useState, useEffect } from "react";
import { getLogsByAction } from "@/app/apis/logs/api"; // Update with the correct path to your API function
import { ChevronLeft, ChevronRight } from "lucide-react";

const Action: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [action, setAction] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (action) {
        setLoading(true);
        try {
          const data = await getLogsByAction(
            currentPage.toString(),
            pageSize.toString(),
            action
          );
          setLogs(data || []);
        } catch (error) {
          alert("Failed to fetch logs. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLogs();
  }, [action, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(event.target.value);
    setCurrentPage(1); // Reset to the first page when action changes
  };

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Action Logs Viewer
      </h1>

      {/* Action Selector */}
      <div className="mb-6 flex gap-4 justify-between">
        <div className="w-2/3">
          <label htmlFor="action" className="font-medium text-gray-700 block mb-1">
            Select Action:
          </label>
          <select
            id="action"
            value={action}
            onChange={handleActionChange}
            className="px-4 py-2 border rounded w-full  bg-white"
          >
            <option value=""> Select Action </option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Page Size Selector */}
        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="pageSize" className="mr-2 font-medium text-gray-700">
              Rows Per Page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-blue-600 font-medium">Loading logs...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse shadow-md">
            <thead>
              <tr className="bg-blue-200 text-gray-700">
                <th className=" px-4 py-2 text-left rounded-tl">ID</th>
                <th className="border px-4 py-2 text-left">Action</th>
                <th className=" px-4 py-2 text-left rounded-tr">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                  >
                    <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4 text-gray-500 font-medium"
                  >
                    No logs available for the selected action.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
            } transition`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="mx-2 text-lg">
          Page {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow 
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
              } transition`}

        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Action;
