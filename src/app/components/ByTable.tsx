import React, { useEffect, useState } from 'react';
import { getLogsByTableName } from '@/app/apis/logs/api';

const Page: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedTable, setSelectedTable] = useState('category_log');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLogsByTableName(
        currentPage.toString(),
        pageSize.toString(),
        selectedTable
      );
      const logs = result || [];
      setData(logs);
      setTotal(result.total || 0);

      if (logs.length > 0) {
        const dynamicColumns = Object.keys(logs[0]);
        setColumns(dynamicColumns);
      } else {
        setColumns([]);
      }
    } catch (err: any) {
      setError(err.message);
      setData([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize, selectedTable]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleTableChange = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Logs Viewer</h1>
      <div className="mb-6">
        <label htmlFor="tableSelector" className="block font-medium mb-2">
          Table Name Selector:
        </label>
        <select
          id="tableSelector"
          value={selectedTable}
          onChange={(e) => handleTableChange(e.target.value)}
          className="px-4 py-2 border rounded w-full"
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <label htmlFor="pageSize" className="mr-2 font-medium">
            Rows per page:
          </label>
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
          <span className="mx-2">
            Page {currentPage} of {Math.ceil(total / pageSize)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(total / pageSize)}
            className="px-4 py-2 border rounded bg-blue-500 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-semibold mb-4">Logs Viewer</h1>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="border border-gray-300 px-4 py-2">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50">
                    {columns.map((column) => (
                      <td key={column} className="border border-gray-300 px-4 py-2">
                        {row[column] !== null && row[column] !== undefined
                          ? row[column]
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}
    </div>
  );
};

export default Page;
