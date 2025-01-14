import React, { useState, useEffect } from "react";
import { getLogsByAction } from "@/app/apis/logs/api"; // Update with the correct path to your API function

const Action: React.FC = () => {
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
          const data = await getLogsByAction(currentPage.toString(), pageSize.toString(), action);
          const selectedLogs = data[`${action.toLowerCase()}Logs`] || [];
          setLogs(selectedLogs);
        } catch (error) {
          console.error("Error fetching logs:", error);
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

  // Extract headers dynamically
  const headers = logs.length > 0 ? Object.keys(logs[0]) : [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Action Logs</h1>

      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="action" className="font-medium">
          Select Action:
        </label>
        <select
          id="action"
          value={action}
          onChange={handleActionChange}
          className="px-4 py-2 border rounded"
        >
          <option value="">-- Select Action --</option>
          <option value="category">Category</option>
          <option value="department">Department</option>
          <option value="invoices">Invoices</option>
          <option value="itemDepartments">Item Departments</option>
          <option value="itemDetails">Item Details</option>
          <option value="items">Items</option>
          <option value="purchaseRequest">Purchase Request</option>
          <option value="purchases">Purchases</option>
          <option value="quotations">Quotations</option>
          <option value="roles">Roles</option>
          <option value="users">Users</option>
          <option value="vendors">Vendors</option>
        </select>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="pageSize" className="font-medium">
          Page Size:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="px-4 py-2 border rounded"
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="border border-gray-300 px-4 py-2 capitalize">
                  {header.replace(/([A-Z])/g, " $1")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-blue-50">
                {headers.map((header) => (
                  <td key={header} className="border border-gray-300 px-4 py-2">
                    {log[header] !== undefined ? log[header] : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No logs available for the selected action.</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={logs.length < pageSize || loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Action;
