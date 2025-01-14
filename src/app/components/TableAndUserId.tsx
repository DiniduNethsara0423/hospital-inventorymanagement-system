import React, { useState, useEffect } from 'react';
import { getAllUsers } from '@/app/apis/get-all-users/api';
import { getLogsByTableNameAndUserId } from '@/app/apis/logs/api';

const TableAndUserId: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState('');
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [pageSize, setPageSize] = useState(5); // Set default page size
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0); // To store the total number of logs

  // Fetch users on component mount
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

  // Fetch logs based on selected table, user ID, page, and page size
  useEffect(() => {
    if (selectedTable && userId) {
      const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getLogsByTableNameAndUserId(
            '1', // Store ID (hardcoded)
            '5', // Another parameter (hardcoded)
            selectedTable,
            userId.toString(),
            currentPage,
            pageSize
          );
          setLogs(data.data || []);
          setTotal(data.total || 0); // Assuming 'total' is returned for total log count
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
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(event.target.value));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(total / pageSize)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Table and User ID</h1>

      {/* Table Name Selector */}
      <div className="mb-6">
        <label htmlFor="tableSelector" className="block font-medium mb-2">Table Name Selector:</label>
        <select
          id="tableSelector"
          value={selectedTable}
          onChange={(e) => handleTableChange(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        >
          <option value="" disabled>-- Select a Table --</option>
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

      {/* User Dropdown */}
      <div className="mb-4">
        <label htmlFor="userDropdown" className="block font-medium mb-1">Select User:</label>
        <select
          id="userDropdown"
          value={userId || ''}
          onChange={handleUserChange}
          className="px-4 py-2 border rounded w-full"
        >
          <option value="" disabled>-- Select a User --</option>
          {loading && <option>Loading users...</option>}
          {error && <option disabled>Error loading users</option>}
          {!loading && !error && users.map((user) => (
            <option key={user.id} value={user.id}>{user.id} - {user.name}</option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Logs</h2>
        {loading && <p>Loading logs...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && logs.length === 0 && <p>No logs available for the selected table and user.</p>}
        {!loading && !error && logs.length > 0 && (
          <>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Log ID</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                  <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination and Page Size */}
            <div className="flex justify-between items-center mt-6">
              <div>
                <label htmlFor="pageSize" className="mr-2 font-medium">Rows per page:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 border rounded"
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
                  className="px-4 py-2 border rounded bg-blue-500 text-white disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="mx-2">Page {currentPage} of {Math.ceil(total / pageSize)}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(total / pageSize)}
                  className="px-4 py-2 border rounded bg-blue-500 text-white disabled:opacity-50"
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
