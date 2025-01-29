import React, { useState, useEffect } from "react";
import { getAllUsers } from "@/app/apis/get-all-users/api";
import { getLogsByTableNameAndUserId } from "@/app/apis/logs/api";

const TableAndUserId: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedTable && userId) {
      const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
          const data: any = await getLogsByTableNameAndUserId(
            "1",
            "5",
            selectedTable,
            userId.toString(),
            currentPage,
            pageSize
          );
          const logs = data|| [];
          setTableData(logs);

          if (logs.length > 0) {
            setHeaders(Object.keys(logs[0]));
          } else {
            setHeaders([]);
          }

          setTotal(logs.length);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchLogs();
    }
  }, [selectedTable, userId, currentPage, pageSize]);

  const handleTableChange = (table: string) => {
    setSelectedTable(table);
    setCurrentPage(1);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(event.target.value));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(total / pageSize)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Dynamic Logs Table</h1>

      {/* Table Selector */}
      <div className="mb-6">
        <label htmlFor="tableSelector" className="block font-medium mb-2 text-gray-700">
          Select Table:
        </label>
        <select
          id="tableSelector"
          value={selectedTable}
          onChange={(e) => handleTableChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            -- Select a Table --
          </option>
          <option value="" disabled>-- Select a Table --</option>
          <option value="category_log">Category Logs</option>
          <option value="department_log">Department Logs</option>
          <option value="invoices_log">Invoices Logs</option>
          <option value="item_departments_log">Item Departments Logs</option>
          <option value="item_details_log">Item Details Logs</option>
          <option value="items_log">Items Logs</option>
          <option value="purchase_request_log">Purchase Request Logs</option>
          <option value="purchases_log">Purchases Logs</option>
          <option value="quotations_log">Quotations Logs</option>
          <option value="roles_log">Roles Logs</option>
          <option value="users_log">Users Logs</option>
          <option value="vendors_log">Vendors Logs</option>
        </select>
      </div>

      {/* User Selector */}
      <div className="mb-4">
        <label htmlFor="userDropdown" className="block font-medium mb-1 text-gray-700">
          Select User:
        </label>
        <select
          id="userDropdown"
          value={userId || ""}
          onChange={handleUserChange}
          className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            -- Select a User --
          </option>
          {loading && <option>Loading users...</option>}
          {error && <option disabled>Error loading users</option>}
          {!loading &&
            !error &&
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.id} - {user.name}
              </option>
            ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4 text-gray-800">Logs</h2>
        {loading && <p>Loading logs...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && tableData.length === 0 && (
          <p className="text-gray-600">No logs available for the selected table and user.</p>
        )}
        {!loading && !error && tableData.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-indigo-100">
                    {headers.map((header: any) => (
                      <th
                        key={header}
                        className="border border-gray-300 px-4 py-2 text-left font-semibold "
                      >
                        {header.replace(/_/g, " ").toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row: any, index: any) => (
                    <tr key={index} className="hover:bg-blue-50">
                      {headers.map((header: any) => (
                        <td key={header} className="border border-gray-300 px-4 py-2">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
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
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded bg-blue-500 text-white disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(total / pageSize)}
                  className="px-4 py-2 border border-gray-300 rounded bg-blue-500 text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TableAndUserId;
