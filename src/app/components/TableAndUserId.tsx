import React, { useState, useEffect } from 'react';
import { getAllUsers } from '@/app/apis/get-all-users/api';
import { getLogsByTableNameAndUserId } from '@/app/apis/logs/api';

const TableAndUserId: React.FC = () => {
  const [userId, setUserId]:any = useState<number | null>(null);
  const [selectedTable, setSelectedTable]:any = useState('');
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [tableData, setTableData]:any = useState<any[]>([]);
  const [headers, setHeaders]:any = useState<string[]>([]);
  const [loading, setLoading]:any = useState(false);
  const [error, setError]:any = useState<string | null>(null);

  const [pageSize, setPageSize]:any = useState(5);
  const [currentPage, setCurrentPage]:any = useState(1);
  const [total, setTotal] = useState(0);

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

  // Fetch logs based on selected table and user ID
  useEffect(() => {
    if (selectedTable && userId) {
      const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
          const data:any = await getLogsByTableNameAndUserId(
            '1', // Store ID (hardcoded)
            '5', // Another parameter (hardcoded)
            selectedTable,
            userId.toString(),
            currentPage,
            pageSize
          );

          const tableLogsKey = `${selectedTable}`; // Map table name to its log key
          const logs = data[tableLogsKey] || [];
          setTableData(logs);

          // Extract headers dynamically
          if (logs.length > 0) {
            const logHeaders = Object.keys(logs[0]);
            setHeaders(logHeaders);
          } else {
            setHeaders([]);
          }

          setTotal(logs.length); // Update total records
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
    setCurrentPage(1); // Reset to first page
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(event.target.value));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(total / pageSize)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Dynamic Logs Table</h1>

      {/* Table Selector */}
      <div className="mb-6">
        <label htmlFor="tableSelector" className="block font-medium mb-2">Select Table:</label>
        <select
          id="tableSelector"
          value={selectedTable}
          onChange={(e) => handleTableChange(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        >
          <option value="" disabled>-- Select a Table --</option>
          <option value="categoryLogs">Category Logs</option>
          <option value="departmentLogs">Department Logs</option>
          <option value="invoicesLogs">Invoices Logs</option>
          <option value="itemDepartmentsLogs">Item Departments Logs</option>
          <option value="itemDetailsLogs">Item Details Logs</option>
          <option value="itemsLogs">Items Logs</option>
          <option value="purchaseRequestLogs">Purchase Request Logs</option>
          <option value="purchasesLogs">Purchases Logs</option>
          <option value="quotationsLogs">Quotations Logs</option>
          <option value="rolesLogs">Roles Logs</option>
          <option value="usersLogs">Users Logs</option>
          <option value="vendorsLogs">Vendors Logs</option>
        </select>
      </div>

      {/* User Selector */}
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
        {!loading && !error && tableData.length === 0 && <p>No logs available for the selected table and user.</p>}
        {!loading && !error && tableData.length > 0 && (
          <>
            <div className="overflow-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {headers.map((header:any) => (
                      <th key={header} className="border border-gray-300 px-4 py-2">
                        {header.replace(/_/g, ' ').toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row:any, index:any) => (
                    <tr key={index} className="hover:bg-blue-50">
                      {headers.map((header:any) => (
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
